/*
Path '/api/login'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require ('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();


router.post('/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La constraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    login
);

router.post('/google',
    [
        check('token', 'el token de Google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    googleSignin
);













module.exports = router;