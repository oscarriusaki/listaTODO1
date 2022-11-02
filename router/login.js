const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controller');
const { validar } = require('../middlewares');

const router = Router();

router.post('/',[

    check('correo','El correo no se ha enviado').not().isEmpty(),
    check('correo','El correo no es valido').isEmail(),
    check('pass','El password no se ha enviado').not().isEmpty(),
    check('pass','El password no es valido').isLength({min:5}),
    validar
    
], login);

module.exports = router;
