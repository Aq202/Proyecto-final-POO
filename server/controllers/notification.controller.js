'use strict'

const Notification = require("../models/notification.model");
const mongoose = require("mongoose");

async function saveNotification({userId, title, text, image, date, viewed, url}) {

    return new Promise((resolve, reject) => {
        
        let notification = new Notification();
        if (userId) {
           
            notification.userId = userId
            notification.title = title || "Nueva notificación.";
            notification.text = text || "Nueva notificación.";
            notification.image = image || null;
            notification.date = date || new Date();
            notification.viewed = viewed==true ? viewed : false;
            notification.url = url || null;

            notification.save((err, saved) => {
                if (err) {
                    reject(err);
                } else if (saved)
                    resolve(saved._id);
                else{
    
                reject("Notificación no guardada");
            }
            })
        } else {

            reject("No se cuenta con el id de usuario");
        }
    })

}

function setAsViewed(req, res) {
    let params = req.body;
    let notificationId = null;
    let userId = req.user.sub;
    try{
        notificationId = mongoose.Types.ObjectId(params.notificationId);
    }catch{
        notificationId = null;
    }
    if(notificationId != null){
        Notification.findById(notificationId,(err,found)=>{
            if(err){
                res.status(500).send({error:"Error interno del servidor",err});
            }else if(found){
                if(found.userId == userId){
                    Notification.findByIdAndUpdate(notificationId,{viewed:true}, {new:true},(err,updated)=>{
                        if(err){
                            res.status(500).send({error:"Error interno del servidor",err});
                        }else if(updated){
                            res.send({message: "Accion exitosa"});
                        }else{
                            res.status(500).send({error:"Ha ocurrido un error inesperado al marcar como vista la notificacion"});
                        }
                    })
                }else{
                    res.status(403).send({message:"No tiene permitido realizar esta accion"});
                }
            }else{
                res.status(404).send({message:"No se han encontrado notificaciones con este Id"});
            }
        });
    }else{
        res.status(400).send({message: "Debe indicar el id de la notificacion que desea marcar como leida"});
    }
    
}

function deleteAllNotifications(req, res){
    let params = req.body;
    let userId = req.user.sub;
    try{
        Notification.deleteMany({userId:userId},(err,deleted)=>{
            if(err){
                res.status(500).send({error:"Error interno del servidor",err});
            }else if(deleted){
                res.send({message:"Accion exitosa"});
            }else{
                res.status(500).send({error:"Ha ocurrido un error inesperado"});        
            }
        })
    }catch{
        res.status(500).send({error:"Ha ocurrido un error inesperado"});
    }
}
function setAllNotificationsAsViewed(req, res){
    let params = req.body;
    let userId = req.user.sub;
    try{
        Notification.updateMany({userId:userId},{viewed:true},{new:true},(err,updated)=>{
            if(err){
                res.status(500).send({error:"Error interno del servidor",err});
            }else if(updated){
                res.send({message:"Accion exitosa"});
            }else{
                res.status(500).send({error:"Ha ocurrido un error inesperado"});        
            }
        })
    }catch{
        res.status(500).send({error:"Ha ocurrido un error inesperado"});
    }
}

function deleteNotification(req,res){
    console.log(req)
    let params = req.body;
    let notificationId = null;
    let userId = req.user.sub;
    try{
        notificationId = mongoose.Types.ObjectId(params.notificationId);
    }catch{
        notificationId = null;
    }
    if(notificationId != null){
        Notification.findById(notificationId,(err,found)=>{
            if(err){
                res.status(500).send({error:"Error interno del servidor",err});
            }else if(found){
                if(found.userId == userId){
                    Notification.findByIdAndDelete(notificationId,(err,deleted)=>{
                        if(err){
                            res.status(500).send({error:"Error interno del servidor",err});
                        }else if(deleted){
                            res.send({message: "Accion exitosa"});
                        }else{
                            res.status(500).send({error:"Ha ocurrido un error inesperado al eliminar la notificacion"});
                        }
                    })
                }else{
                    res.status(403).send({message:"No tiene permitido realizar esta accion"});
                }
            }else{
                res.status(404).send({message:"No se han encontrado notificaciones con este Id"});
            }
        });
    }else{
        res.status(400).send({message: "Debe indicar el id de la notificacion que desea eliminar"});
    }
}

function getNotifications(req, res) {
    let params = req.body;
    let skipped = params.skip ? parseInt(params.skip) : 0;
    let quantity = params.quantity ? parseInt(params.quantity) : 10;
    let order = (params.ascending && params.ascending == "true") ? 1 : -1;
    Notification.find({userId: req.user.sub}, (err, found) => {
        if (err) {
            res.status(500).send({ error: 'Error interno del servidor', err });
        } else if (found && found.length > 0) {
            res.send({ notifications: found });
        } else {
            res.status(404).send({ message: 'No hay datos para mostrar' });
        }
    }).skip(skipped).limit(quantity).sort({ publishDate: order });
}

module.exports = {
    saveNotification,
    setAsViewed,
    deleteNotification,
    setAllNotificationsAsViewed,
    deleteAllNotifications,
    getNotifications
}