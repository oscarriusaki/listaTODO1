const { Router } = require('express');
const { check } = require('express-validator');
const { getTarea, getTareas, postTarea, putTarea, deleteTarea, finalizarTarea } = require('../controller');
const { validar, validarJWT } = require('../middlewares');

const rutas = Router();

rutas.get('/', getTareas);

rutas.get('/:id',
    // validarJWT,
    check('id', 'El id no es valido').isNumeric(),
    validar
, getTarea);

rutas.post('/',[
    validarJWT,
    check('titulo', 'El titulo no se ha enviado').not().isEmpty(),
    check('titulo', 'El titulo no es valido').isLength({min:1}),
    check('descripcion', 'La descripcion no se ha enviado').not().isEmpty(),
    check('descripcion', 'La descripcion no es valida').isLength({min:1}),
    validar
], postTarea);

rutas.put('/:id',[
    validarJWT,
    check('titulo', 'El titulo no se ha enviado').not().isEmpty(),
    check('titulo', 'El titulo no es valido').isLength({min:1}),
    check('descripcion', 'La descripcion no se ha enviado').not().isEmpty(),
    check('descripcion', 'La descripcion no es valida').isLength({min:1}),
    check('finalizada', 'El valor de finalizada no se ha enviado').not().isEmpty(),
    check('finalizada', 'El valor de finalizada no es valido').isNumeric(),
    validar
], putTarea);

rutas.delete('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isNumeric(),
    validar
], deleteTarea);

rutas.put('/operaciones/:id',[
    validarJWT,
    check('id', 'El id no es valido').isNumeric(),
    validar
], finalizarTarea)

module.exports = rutas;