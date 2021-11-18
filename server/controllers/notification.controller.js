'use strict'

const Notification = require("../models/notification.model");
const mongoose = require("mongoose");

function saveNotification(notificationData){
    let notification = new Notification();
    if(notificationData.userId && notificationData.title && notificationData.text && notificationData.image && notificationData.date && notificationData.viewed && notificationData.url){
        notification.title = notificationData.title;
        notification.text = notificationData.text;
        notification.image = notificationData.image;
        notification.date = notificationData.date;
        notification.viewed = notificationData.viewed;
        notification.url = notificationData.url;
        notification.userId = notificationData.userId;

        notification.save((err,saved)=>{
            if(err){
                console.log(err);
                return null;
            }else if(saved)
                return saved._id;
            else
                return null;
        })
    }else{
        return null;
    }
}

function setAsViewed(req,res){
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

function deleteAllNotifications(err,res){
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

function setAllNotificationsAsViewed(err,res){
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

module.exports = {
    saveNotification,
    setAsViewed,
    deleteNotification,
    setAllNotificationsAsViewed,
    deleteAllNotifications
}