const { Router, response } = require('express');

const rutas = Router();

// mostramos una pagina de error por si entra a una ruta diferente el usuario

rutas.get( '*', (req, res = response) => {

    res.sendFile(__dirname.substring(0, __dirname.search('router')) + 'public/404.html');

});

// mostramos mensaje de la ruta correcta al desarollador de front end en caso
// de poner una ruta diferente

rutas.post( '*', (req, res = response) => {

    return res.status(404).json({
        msg: 'Error de la ruta'
    });

});

rutas.put('*', (req, res = response) => {

    return res.status(404).json({
        msg: 'Error de la ruta'
    });

});

rutas.delete('*', (req, res = response) => {
    
    return res.status(404).json({
        msg: 'Error de la ruta'
    });

});

module.exports = rutas;