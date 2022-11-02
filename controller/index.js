const login = require('../controller/login');
const tarea = require('../controller/tarea');
const usuario = require('../controller/usuario');

module.exports  = {

    ...login,
    ...tarea,
    ...usuario
    
}