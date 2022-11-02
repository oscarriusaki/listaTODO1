const validar = require('../middlewares/validar');
const validarJWT = require('../middlewares/validarJWT');

module.exports = {
    
    ...validar,
    ...validarJWT,

}