const { response } = require("express");
const { generarJWT } = require("../helpers/generarWJT");
const bcryptjs = require('bcryptjs');
const db = require("../database/config");

const getUsers = async (req, res = response) => {

    const mysql = await db;

    // estado = 1 -> usuario no esta eliminado
    // estado = 0 -> usuario esta eliminado
    
    const sql = 'SELECT * FROM usuario WHERE estado = ?';
    
    mysql.query( sql, [ 1 ], function(err, result){
        
        if(err){

            return res.status(500).json({
                msg: err.sqlMessage,
            });

        }else{

            if(result.length !== 0){
               
                result.map(resp => {
                    return {...resp};
                });
               
                return res.status(200).json(
                    result
                );

            }else{

                return res.status(404).json({
                    msg: 'No existe registros de usuarios en la base de datos' 
                });

            }

        }

    })
}

const getUser = async (req, res = response) => {

    const mysql = db;
    const { id } = req.params;

    const sql = 'SELECT * FROM USUARIO WHERE id_usuario = ? AND estado = ?';
    
    mysql.query( sql, [ id, 1], function(err, result){

        if(err){
            
            return res.status(500).json({
                msg: err.sqlMessage
            });

        }else{

            if(result.length === 1){

                result.map(resp => {
                    return {resp}
                });

                return res.status(200).json(
                    result 
                );

            }else{

                return res.status(404).json({
                    msg: `No se encontro el usuario con el id ${id}`
                });

            }

        }

    });

}

const postUser = async (req, res = response) => {
    
    const mysql = await db;
    const { is_usuario, ...usuario } = req.body;
    let token = '';

    // ponermos un try{}catch(){} por si nos da algun error

    try{

        // generamos el jwt
        token = await generarJWT(usuario.correo);
        
        // incriptando contraseña
        // generamos la salt con una intensidad de 10 por defecto, si quiere mayor proteccion poner un numero elevado
        const salt = bcryptjs.genSaltSync();
        usuario.pass = bcryptjs.hashSync(usuario.pass, salt);
    
    }catch(err){
            console.log(err)
        return res.status(500).json({
            msg: 'Error hable con el adminstrador'
        })

    }

    const yy = new Date().getFullYear();
    const mm = new Date().getMonth()+1;
    const dd = new Date().getDate();

    const sql1 = 'SELECT * FROM USUARIO WHERE correo = ? AND estado = ?';
    const sql2 = 'INSERT INTO USUARIO (nombre, pass, correo, token, estado, fecha) values(?,?,?,?,?,?)';
    const sql3 = 'SELECT * FROM USUARIO WHERE correo = ? and token = ? and estado = ?';

    mysql.query( sql1, [ usuario.correo, 1], function(err, result){

        if(err){

            return res.status(500).json({
                msg: err.sqlMessage
            });

        }else{

            if(result.length !== 1){

                mysql.query( sql2, [ usuario.nombre, usuario.pass, usuario.correo, token, 1, (yy + "/" + mm + "/" + dd)], function(err2, result){
                    
                    if(err2){

                        return res.status(500).json({
                            msg: err2.sqlMessage
                        });

                    }else{
                        
                        if(result.affectedRows === 1){

                            mysql.query( sql3, [ usuario.correo, token, 1], function(err, result){

                                if(err){

                                    return res.status(500).json({
                                        msg: err.sqlMessage
                                    });

                                }else{

                                    if(result.length === 1){

                                        req.usuario = result[0];
                                        
                                        return res.status(201).json({
                                            msg: 'Registrado correctamente',
                                            token: token
                                        });
                                    
                                    }else{

                                        return res.status(400).json({
                                            msg: 'Error al buscar el usuario registrado'
                                        });

                                    }
                                
                                }
    
                            });

                        }else{
                            
                            return res.status(400).json({
                                msg: 'Hubo un error al registrar un usuario'
                            });

                        }

                    }

                });

            }else{

                return res.status(400).json({
                    msg: `Error el correo ${usuario.correo} ya se encuentra registrado`
                });

            }

        }
    });
}
const putUser = async (req, res = response) => {
    
    const mysql = await db;
    const usuario_logueado = req.usuario.id_usuario;

    const { id } = req.params;
    const { usuario_id, ...usuario } = req.body;
    
    // Encriptamos la contraseña 
    if( usuario.pass ){

        const salt = bcryptjs.genSaltSync();
        usuario.pass = bcryptjs.hashSync(usuario.pass, salt);

    }
    
    // Generamos un nuevo token por si el usuario camsbia el correo
    let token ='';
    if( usuario.correo ){
        token = await generarJWT(usuario.correo);
    }

    const yy = new Date().getFullYear();
    const mm = new Date().getMonth()+1;
    const dd = new Date().getDate();

    // verificamos que exista el usuario al que quiere actualizar
    const sql = 'SELECT * FROM usuario WHERE id_usuario = ? AND estado = ?';
    // verificamos que el correo que nos manda sea unico, y si nos manda el mismo correo si se puede actualiza
    const sql2 = 'SELECT * FROM  usuario WHERE correo = ?';
    // actualizamos 
    const sql3 = 'UPDATE usuario SET nombre = ?, pass = ?, correo = ?, token = ?, fecha = ? WHERE id_usuario = ?';

    mysql.query( sql,[ id, 1], function(err, result){
        
        if(err){
            
            return res.status(500).json({
                msg: err.sqlMessage
            })

        }else{

            if(result.length === 1){

                if(result[0].id_usuario === usuario_logueado){
                
                    mysql.query( sql2, [ usuario.correo ], function(err, result){
                    
                    if(err){

                        return res.status(500).json({
                            msg: err.sqlMessage
                        });

                    }else{

                        if((result.length ===0) || (result[0].id_usuario+'' === id+'')){

                            mysql.query( sql3, [ usuario.nombre, usuario.pass, usuario.correo, token, (yy + "/" + mm + "/" + dd),id], function (err, result){

                                if(err){
                                    
                                    return res.status(500).json({
                                        msg: err.sqlMessage
                                    });

                                }else{

                                    return res.status(200).json({
                                        msg: 'Actualizado correctamente'
                                    });

                                }

                            })

                        }else{

                            return res.status(400).json({
                                msg: 'Error el correo ya esta registrado '
                            });

                        }

                    }

                    });

                }else{
                
                    return res.status(401).json({
                        msg: 'El token no pertenece al usuario'
                    });
                
                }

            }else{

                return res.status(404).json({
                    msg: `El usuario con id ${id} no existe`
                });

            }
            
        }
    
    });

}

const deleteUser = async (req, res = response) => {
    
    const mysql = await db;
    const usuario_logueado = req.usuario.id_usuario;
    
    const { id } = req.params;

    const sql = 'SELECT * FROM usuario where estado = ? and id_usuario = ?';
    const sql2 = 'UPDATE USUARIO SET estado = ? where id_usuario = ?';
 
    // estado = 1 -> usuario no eliminado
    // estado = 0 -> usuario eliminado

    mysql.query( sql, [ 1, id], function(err, result){

        if(err){
            
            return res.status(500).json({
                msg: err.sqlMessage
            });

        }else{

            if(result.length === 1){

                if(result[0].id_usuario === usuario_logueado){

                    mysql.query( sql2, [ 0, id], function(err, result){

                        if(err){

                            return res.status(500).json({
                                msg: err.sqlMessage
                            });

                        }else{

                            if(result.affectedRows === 1){

                                return res.status(200).json({
                                    msg: 'Eliminado'
                                });

                            }else{

                                return res.status(400).json({
                                    msg: 'Error se afecto a varias columas revisar la base de datos'
                                });

                            }

                        }

                    });
                
                }else{

                    return res.status(401).json({
                        msg: 'El token no pertenece al usuario'
                    });

                }

            }else{       
                
                return res.status(404).json({
                    msg: `No existe el usuario con el id ${id}`
                });

            }

        }

    });

}

module.exports = {
    
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser

}