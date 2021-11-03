'use strict'

const User = require('../models/user.model');
const Product = require('../models/product.model');
const Request = require('../models/request.model');

function approveRequest(req,res){
    const params = req.body;
    const userId = req.user.sub;
    if(params.requestId){
        let requestId = params.requestId;
        Request.findById(requestId,(err,found)=>{
            if(err){
                res.status(500).send({error:"Error interno del servidor"});
            }else if(found){
                Product.findById(found.productId,(err,productFound)=>{
                    if(err){
                        res.status(500).send({error:"Error interno del servidor"});
                    }else if(productFound){
                        if(productFound.ownerId == userId){
                            Request.findByIdAndUpdate(requestId,{approved:true},{new:true},(err,updated)=>{
                                if(err){
                                    res.status(500).send({error:"Error interno del servidor"});
                                }else if(updated){
                                    Product.findByIdAndUpdate(updated.productId,{available:false},{new:true},(err,productUpdated)=>{
                                        if(err){
                                            res.status(500).send({error:"Error interno del servidor"});
                                        }else if(productUpdated){
                                            res.send({
                                                "Solicitud aceptada": updated._id,
                                                "Petitioner": updated.petitionerId,
                                                "Requested Date": updated.requestedDate,
                                                "Approved" : updated.approved
                                            });
                                        }else{
                                            res.status(500).send({error:"Se ha producido un error inesperado al cambiar la disponibilidad del producto."});
                                        }
                                    })
                                }else{
                                    res.status(500).send({error:"Se ha producido un error inesperado al rechazar la solicitud"});
                                }
                            })
                        }else{
                            res.status(403).send({message:"No tiene permitido realizar esta accion"});
                        }
                    }else{
                        cancelRequest(found,res,"El producto relacionado a esta solicitud ha sido eliminado o no existe, la solicitud será cancelada.",404);
                    }
                })
            }else{
                res.status(404).send({message: "No se han encontrado solicitudes con el ID indicado."});
            }
        });
    }else{
        res.status(400).send({message: "Debe ingresar el id de la solicitud que desea rechazar."});
    }
}

function deleteRequest(req,res){
    const params = req.body;
    const userId = req.user.sub;
    if(params.requestId){
        let requestId = params.requestId;
        Request.findById(requestId,(err,found)=>{
            if(err){
                console.log(err);
                res.status(500).send({error:"Error interno del servidor"});
            }else if(found){
                if(found.petitionerId != userId){
                    res.status(403).send({message:"No tiene permitido realizar esta accion"});
                }else if(found.approved == true){
                    res.status(403).send({message: "La solicitud ya ha sido aprobada, no puede eliminarla."});
                }else{
                    Request.findByIdAndDelete(requestId,(err,deleted)=>{
                        if(err){
                            res.status(500).send({error:"Error interno del servidor"});
                        }else if(deleted){
                            Product.findByIdAndUpdate(deleted.productId,{$pull:{interested:deleted.petitionerId}},{new:true},(err,updated)=>{
                                if(err){
                                    console.log(err);
                                    res.status(500).send({error:"Error interno del servidor"});
                                }else if(updated){
                                    res.send({message: "Solicitud eliminada con exito"});
                                }else{
                                    res.status(418).send({error:"Ha ocurrido un error inesperado al retirar al usuario de la lista de interesados en el producto."});        
                                }
                            })
                        }else{
                            res.status(418).send({error:"Ha ocurrido un error inesperado al eliminar la solicitud."});
                        }
                    });
                }
            }else{
                res.status(400).send({message: "No se han encontrado solicitudes con el ID especificado."});
            }
        })
    }else{
        res.status(400).send({message:"Debe ingresar el id de la solicitud que desea eliminar"});
    }
}

function rejectRequest(req,res){
    const params = req.body;
    const userId = req.user.sub;
    if(params.requestId){
        let requestId = params.requestId;
        Request.findById(requestId,(err,found)=>{
            if(err){
                res.status(500).send({error:"Error interno del servidor"});
            }else if(found){
                Product.findById(found.productId,(err,productFound)=>{
                    if(err){
                        res.status(500).send({error:"Error interno del servidor"});
                    }else if(productFound){
                        if(productFound.ownerId == userId){
                            Request.findByIdAndUpdate(requestId,{approved:false},{new:true},(err,updated)=>{
                                if(err){
                                    res.status(500).send({error:"Error interno del servidor"});
                                }else if(updated){
                                    Product.findByIdAndUpdate(updated.productId,{available:true},{new:true},(err,productUpdated)=>{
                                        if(err){
                                            res.status(500).send({error:"Error interno del servidor"});
                                        }else if(productUpdated){
                                            res.send({
                                                "Solicitud rechazada": updated._id,
                                                "Petitioner": updated.petitionerId,
                                                "Requested Date": updated.requestedDate,
                                                "Approved" : updated.approved
                                            });
                                        }else{
                                            res.status(418).send({error:"Se ha producido un error inesperado al cambiar la disponibilidad del producto."});
                                        }
                                    })
                                }else{
                                    res.status(418).send({error:"Se ha producido un error inesperado al rechazar la solicitud"});
                                }
                            })
                        }else{
                            res.status(403).send({message:"No tiene permitido realizar esta accion"});
                        }
                    }else{
                        cancelRequest(found,res,"El producto relacionado a esta solicitud ha sido eliminado o no existe, la solicitud será cancelada.",404);
                    }
                })
            }else{
                res.status(404).send({message: "No se han encontrado solicitudes con el ID indicado."});
            }
        });
    }else{
        res.status(400).send({message: "Debe ingresar el id de la solicitud que desea rechazar."});
    }
}

function getRequest(req,res){
    const params = req.body;
    if(params.requestId){
        let requestId = params.requestId;
        Request.findById(requestId, (err,found)=>{
            if(err){
                console.log(err);
                res.status(500).send({ error: 'Error interno del servidor'});
            }else if(found){
                User.findById(found.petitionerId,(err,userFound)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send({ error: 'Error interno del servidor'});
                    }else if(userFound){
                        res.send({
                            "Solicitud encontrada": found._id,
                            "Petitioner": userFound._id,
                            "Petitioner name": userFound.name + " " + userFound.lastname,
                            "Profile picture": userFound.profilePic,
                            "Requested Date": found.requestedDate,
                            "Approved" : found.approved
                        });
                    }else{
                        cancelRequest(found, res, "El usuario que ha realizado la peticion no existe o ha eliminado su cuenta.",404);
                    }
                })
            }else{
                res.status(404).send({message:"No se han encontrado solicitudes con el ID especificado."});
            }
        });
    }else{
        res.status(400).send({message:"Debe indicar el id de la solicitud que desea revisar"});
    }
}

function newRequest(req,res){
    const petitioner = req.user.sub;
    const request = new Request();
    const params = req.body;
    const date = new Date();
    date.setTime(date.getTime()-(6*60*60*1000))

    if(params.productId && params.message){
        let productId = params.productId;
        Product.findById(productId, (err,found)=>{
            if(err){
                console.log(err);
                res.status(500).send({ error: 'Error interno del servidor'});
            }else if(found){
                if(found.ownerId == petitioner){
                    res.status(400).send({message: "No puede solicitar su propia donacion."});
                }else if(found.interested.includes(petitioner)){
                    res.status(400).send({message: "Ya ha enviado una solicitud para adquirir esta donacion."});
                }else{
                    request.productId = found._id;
                    request.petitionerId = petitioner;
                    request.requestedDate = date;
                    request.message = params.message;
                    request.approved = null;

                    request.save((err,saved)=>{
                        if(err){
                            console.log(err);
                            res.status(500).send({ error: 'Error interno del servidor', err });
                        }else if(saved){
                            Product.findByIdAndUpdate(found._id, {$push: {interested : petitioner}},{new:true}, (err, updated)=>{
                                if(err){
                                    console.log(err);
                                    cancelRequest(saved , res, "Error interno del servidor",500);
                                }else if(updated){
                                    res.send({
                                        "Solicitud realizada con exito": saved._id,
                                        "Product requested": productId,
                                        "User petitioner": petitioner,
                                        "Requested Date": saved.requestedDate,
                                        "Message sent": saved.message,
                                        "Approved" : saved.approved
                                    });
                                }else{
                                    cancelRequest(saved, res, "Ha ocurrido un problema al agregar la solicitud al registro", 418);
                                }
                            });
                        }else{
                            res.status(418).send({message:"Ha ocurrido un error al crear la solicitud"});
                        }
                    })
                }
            }else{
                res.status(404).send({message: "No se han encontrado productos con este ID."});
            }
        })
    }else if(!params.productId){
        res.status(400).send({message: "Debe indicar el ID del producto a solicitar."});
    }else if(!params.message){
        res.status(400).send({message: "Debe introducir el mensaje que desea enviar al donador."});
    }else{
        res.status(400).send({message: "Debe llenar los campos solicitados."});
    }
}

function cancelRequest(request, res, message, status){
    Request.findByIdAndDelete(request._id,(err,deleted)=>{
        if(err){
            res.status(500).send({ error: 'Error interno del servidor'});
            console.log(err);
        }else if(deleted){
            res.status(status).send({ error: message});
        }else{
            res.status(400).send({error: 'Ha ocurrido un problema al enviar la solicitud al usuario que la ha realizado, la solicitud fue realizada pero inhabilitada.'});
        }
    });
}

module.exports={
    newRequest,
    getRequest,
    rejectRequest,
    approveRequest,
    deleteRequest
}