const Usuario = require('../models/usuario.model');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {
    const usuarios = await Usuario.find({}, 'nombre email role google')
    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    });
}

const crearUsuario = async(req, res = response) => {
    const { email, password, nombre } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //grabar en la base de datos
        await usuario.save();

        // Crear JWT
        const token = await generarJWT(usuario._id);

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const actualizarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: true,
                msg: 'No existe el usuario con ese ID'
            });
        }

        const { password, google, email, ...campos } = req.body;
        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        campos.email = email;

        //TODO: Validar token y comprobar si el ususarioe es correcto
        //Actualizaciones
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true, useFindAndModify: false });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: true,
                msg: 'No existe el usuario con ese ID'
            });
        }
        await Usuario.findOneAndDelete(uid);

        res.status(400).json({
            ok: true,
            uid,
            msg: 'Usuario borrado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}