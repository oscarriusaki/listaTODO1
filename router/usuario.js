const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, getUser, postUser, putUser, deleteUser } = require('../controller');
const { validar, validarJWT } = require('../middlewares');

const rutas = Router();

rutas.get('/', getUsers);

rutas.get('/:id',[
    check('id', 'El id no es valido').isNumeric(),
    validar
], getUser);

rutas.post('/', [
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('nombre', 'El nombre no es valido debe ser mas de 2 letras').isLength({min:2}),
    check('correo', 'El email no se ha enviado').not().isEmpty(),
    check('correo', 'El email no es valido').isEmail(),
    check('pass', 'La contrasena no se ha enviado').not().isEmpty(),
    check('pass', 'La contrasena debe ser mas de 5 letras').isLength({min: 5}),
    validar
], postUser);

rutas.put('/:id',[
    validarJWT,
    check('id', 'El id no es valido').isNumeric(),
    check('nombre', 'El nombre no se ha enviado').not().isEmpty(),
    check('nombre', 'El nombre debe ser mas de 2 caracteres').isLength({min:2}),
    check('correo', 'El email no se ha enviado').not().isEmpty(),
    check('correo', 'El email no es valido').isEmail(),
    check('pass', 'El password no se ha enviado').not().isEmpty(),
    check('pass', 'El password debe ser mas de 5 letras').isLength({min:5}),
    // ojo se puede verificar que es jwt con "isWJWT"
    // check('token', 'El token no es valido').isJWT(),
    // check('token', 'El token no se ha enviado').not().isEmpty(),
    // check('token', 'El token no es valido').isLength({min:1}),
    validar
], putUser);

rutas.delete('/:id',[
    validarJWT,
    check('id', 'El id no es valido').isNumeric(),
    check('id', 'El id debe ser mas de 1 letra').isLength({min:1}),
    validar
], deleteUser);

module.exports = rutas;