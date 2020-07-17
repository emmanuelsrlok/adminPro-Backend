/*
    Ruta: /api/login
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { login } = require('../controllers/auth.controller');

const router = Router();

router.post('/', [
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos,
    ],
    login
)



module.exports = router;