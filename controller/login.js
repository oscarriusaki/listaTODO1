const { response } = require('express');
const { generarJWT } = require('../helpers/generarWJT');
const bcryptjs = require('bcryptjs');
const db = require('../database/config');

const login = async (req, res = response) => {
    
    const mysql = await db;
    let token = '';

    const { pass, correo } = req.body;
    
    const sql = 'SELECT * FROM usuario WHERE correo = ? AND estado = ?'; // <- esta linea es para evitar injeccion sql
    const sql2 = 'UPDATE usuario SET token = ? WHERE id_usuario = ? and correo = ? and estado = ? '; // <- esta linea es para evitar injeccion sql

    mysql.query( sql,[ correo, 1], async function(err , result){
        
        if(err){

            return res.status(500).json({
                msg: err.sqlMessage
            });
            
        }else{

            result.map(resp => (
                 {...resp[0]}
            ));

            if(result.length === 1){
                
                // ponemos un try{}catch(){} si hay error al desincriptar o al generar token y para algun otro error
                try{
                    
                    // desincriptamos la contrasenia 
                    const validarPassword = bcryptjs.compareSync(pass, result[0].pass);
                    
                    if( validarPassword ){

                        // generamos el token
                        token = await generarJWT(correo);

        
                        mysql.query(sql2, [token, result[0].id_usuario, result[0].correo,1], function(err, result){
                            
                            if(err){

                                return res.status(500).json({
                                    msg: err.sqlMessage
                                });

                            }else{

                                return res.status(200).json({
                                    msg: 'Usuario logueado correctamente',
                                    token: token,
                                });

                            }

                        });
                        
                    }else{

                        return res.status(400).json({
                            msg: 'Usuario o contraseña incorrecta'
                        });

                    }
                    
                }catch(err){

                    return res.status(500).json({
                        msg: 'Hable con el administrador'
                    });

                }

            }else{

                return res.status(404).json({
                    msg: `No se encontro el usuario con el correo ${correo}`
                });
                
            }

        }
        
    });

}

module.exports = {

    login

}