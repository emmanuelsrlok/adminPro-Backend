const { response } = require('express');
const Hospital = require('../models/hospital.model')
const Usuario = require('../models/usuario.model')
const Medico = require('../models/medicos.model')

const getTodo = async(req, res) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const [usuarios, medicos, hospitales] = Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex })
    ]);

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    })
}

const getDocumentosColeccion = async(req, res) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');
    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                .populate('usuario', 'nombre ing')
                .populate('hospital', 'nombre ing');

            break;
        case 'hospitales':

            data = await Hospital.find({ nombre: regex })
                .populate('usuario', 'nombre ing');

            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });

            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser ususarios/hospitales/medicos'
            });

    }
    res.json({
        ok: true,
        resultado: data
    })

}

module.exports = {
    getTodo,
    getDocumentosColeccion
}