const { response } = require("express");
const db = require("../database/config");

const getTareas = (req, res = response) => {

    const mysql = db;

    const sql = 'SELECT * FROM tarea WHERE estado = ?';
    
    mysql.query( sql, [ 1 ], function(err, result){
        
        if(err){
            
            return res.status(500).json({
                msg: err.sqlMessage
            });

        }else{

            result.map(resp => {
                return {...resp}
            });
            
            if(result.length !== 0){

                return res.status(200).json({
                    msg: result
                });

            }else{

                return res.status(404).json({
                    msg: 'No se encontraron ninguna tarea'
                });

            }   

        }

    });
    
}

const getTarea = async (req, res = response) => {
    
    const mysql = await db;
    
    const { id } = req.params;
    
    const sql = 'SELECT * FROM TAREA WHERE id_tarea = ? and estado = ?';

    mysql.query( sql, [ id, 1], function(err, result){
        
        if(err){
            
            return res.status(500).json({
                msg: err.sqlMessage
            });

        }else{

            if(result.length === 1){
                
                    return res.status(200).json({
                        msg: result[0]
                    });

            }else{

                return res.status(404).json({
                    msg: `No se encontro la tarea con id ${id}`
                });

            }

        }

    });

}

const postTarea = async(req, res = response) => {

    const mysql = await db;
    const id_usuario_logueado = req.usuario.id_usuario;
    
    const { id_tarea, ... tarea} = req.body;

    const yy = new Date().getFullYear();
    const mm = new Date().getMonth()+1;
    const dd = new Date().getDate();

    const sql = 'INSERT INTO TAREA (titulo, descripcion, fecha, estado, id_usuario) values (?,?,?,?,?)';

    mysql.query( sql, [ tarea.titulo, tarea.descripcion, ( yy +"/"+mm+"/"+dd ), 1, id_usuario_logueado], function(err, result){
        
        if(err){
            
            return res.status(500).json({
                msg: err.sqlMessage
            });

        }else{

            if(result.affectedRows === 1){

                return res.status(200).json({
                    msg: 'Tarea registrado'
                });

            }else{

                return res.status(400).json({
                    msg: 'Error al registrar tarea'
                });

            }

        }

    });
}

const putTarea = async (req, res = response) => {

    const mysql = await db;
    const usuario_logueado = req.usuario.id_usuario;
    
    const { id } = req.params;
    const { id_tarea, ...tarea} = req.body;

    const yy = new Date().getFullYear();
    const mm = new Date().getMonth()+1;
    const dd = new Date().getDate();

    const sql = 'SELECT * FROM TAREA WHERE id_tarea = ? AND estado = ?';
    const sql2 = 'UPDATE TAREA SET titulo = ?, descripcion = ?, finalizada = ?, fecha = ? WHERE id_tarea = ?';

    mysql.query( sql, [ id, 1], function(err, result){

        if(err){
            
            return res.status(500).json({
                msg: err.sqlMessage
            });
            
        }else{

            if(result.length === 1){

                if(result[0].id_usuario === usuario_logueado){
    
                    mysql.query( sql2,[ tarea.titulo, tarea.descripcion, tarea.finalizada, ( yy +"/"+mm+"/"+dd ), id], function(err, result){
                        
                        if(err){
    
                            return res.status(500).json({
                                msg: err.sqlMessage
                            });
    
                        }else{
    
                            if(result.affectedRows === 1){
                                
                                return res.status(200).json({
                                    msg: 'Tarea actualizada'
                                });
    
                            }else{
    
                                return res.status(400).json({
                                    msg: 'Error al actualizar'
                                });
    
                            }
    
                        }
    
                    });

                }else{
                    
                    return res.status(401).json({
                        msg: `El token no pertenece al usuario con id ${usuario_logueado}`
                    });

                }

            }else{

                return res.status(404).json({
                    msg: `No se encontro una tarea con el id ${id}`
                });

            }

        }

    });

}

const deleteTarea = async (req, res = response) => {
    
    const mysql = await db;
    const usuario_logueado = req.usuario.id_usuario;
    
    const { id } = req.params;

    const sql = `SELECT * FROM TAREA WHERE id_tarea = ? AND estado = ?`;
    const sql2 = `UPDATE TAREA SET estado = ? WHERE id_tarea = ?`;

    mysql.query( sql, [ id, 1], function(err, result) {
        
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
                                    msg: 'tarea eliminado'
                                });

                            }else{

                                return res.status(400).json({
                                    msg: 'Error al eliminar'
                                });

                            }

                        }

                    });

                }else{
                
                    return res.status(401).json({
                        msg: `El token no pertenece al usuario con id ${usuario_logueado}`
                    });
                
                }

            }else{
                
                return res.status(404).json({
                    msg: `No existe la tarea con id ${id}`
                });

            }

        }
    });

}

const finalizarTarea = async ( req, res = response) => {

    // finalizada = 1 -> se finalizo la tarea
    // finalizada = 0 -> no se finalizo la tarea

    const mysql = await db;
    const usuario_logueado = req.usuario.id_usuario;

    const { id } = req.params;

    const sql = 'SELECT * FROM TAREA WHERE id_tarea = ? and estado = ? AND id_usuario = ?';
    // const sql2 = 'UPDATE TAREA SET finalizada = !finalizada WHERE id_tarea = ? AND estado = ? AND id_usuario = ?';
    const sql2 = 'UPDATE TAREA SET finalizada = !(SELECT finalizada FROM TAREA WHERE id_tarea = ? and estado = ? AND id_usuario = ?) WHERE id_tarea = ? AND estado = ? AND id_usuario = ?';

    mysql.query( sql, [ id, 1, usuario_logueado], function(err, result){
        
        if(err){

            return res.status(500).json({
                msg: err.sqlMessage
            });

        }else{

            if(result.length === 1){

                // mysql.query( sql2, [ id, 1, usuario_logueado ], function (err, result){
                mysql.query( sql2, [ id, 1, usuario_logueado, id, 1, usuario_logueado], function(err, result){

                    if(err){
                        
                        return res.status(500).json({
                            msg: err.sqlMessage
                        });

                    }else{

                        if(result.affectedRows === 1){
                            
                            mysql.query( sql, [ id, 1, usuario_logueado], function(err, result){

                                if(err){
                                    
                                    return res.json({
                                        msg: err.sqlMessage
                                    });

                                }else{

                                    if(result.length === 1){

                                        return res.status(200).json({
                                            msg: (result[0].finalizada === 1)? 'Tarea finalizada': 'Tarea no finalizada'
                                         });

                                    }else{

                                        return res.status(400).json({
                                            msg: 'Error al buscar la tarea modificada'
                                        })

                                    }

                                }

                            });
                            

                        }else{

                            return res.status(400).json({
                                msg: 'Error al finalizar una tarea'
                            })

                        }

                    }

                })

            }else{

                return res.status(404).json({
                    msg: `No se encontro la tarea con el id ${ id }`
                })

            }

        }

    });

}

module.exports = {
    
    getTareas,
    getTarea,
    postTarea,
    putTarea,
    deleteTarea,
    finalizarTarea

}