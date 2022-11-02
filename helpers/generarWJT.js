const jwt = require('jsonwebtoken');

const generarJWT = (correo = '') => {

    return new Promise((resolve, reject) => {

        const payload = {correo};
        
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            
            // en esta linea de codigo se cambia el tiempo de vigencia del token
            expiresIn: '320s'

        },(err, token) =>{

            if(err){

                console.log(err);
                reject('Error al generar JWT');

            }else{

                resolve(token);

            }
            
        });

    });

}

module.exports = {

    generarJWT
    
}