'use strict'

const User = require('../models/user.model');
const Product = require('../models/product.model');
const Request = require('../models/request.model');
const mongoose = require('mongoose');
const NewRequestEmail = require('../services/NewRequestEmail');
const Notifications = require('../services/Notifications');
const RequestRejectedEmail = require('../services/RequestRejectedEmail');
const RequestApprovedEmail = require('../services/RequestApprovedEmail');
const DonationConfirmedAsReceivedEmail = require('../services/DonationConfirmedAsReceivedEmail');
const DonationRejectedByBeneficiaryEmail = require('../services/DonationRejectedByBeneficiaryEmail');

function getRequest(req, res) {
    const params = req.body;
    let requestId
    try {
        requestId = mongoose.Types.ObjectId(params.requestId);
    } catch {
        requestId = null;
    }
    if (requestId != null) {
        Request.findById(requestId, (err, found) => {
            if (err) {

                res.status(500).send({ error: 'Error interno del servidor' });
            } else if (found) {
                if (req.user.sub == found.ownerId) {

                    User.findById(found.petitionerId, (err, userFound) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send({ error: 'Error interno del servidor' });
                        } else if (userFound) {

                            let request = {
                                idRequest: found._id,
                                petitionerId: userFound._id,
                                name: userFound.name + " " + userFound.lastname,
                                profilePicture: userFound.profilePic,
                                username: userFound.username,
                                requestedDate: found.requestedDate,
                                approved: (found.approved == true ? found.approved : false),
                                email: userFound.email,
                                dpi: userFound.dpi,
                                sex: userFound.sex,
                                age: userFound.age,
                                documents: userFound.documents,
                                message: found.message
                            }
                            res.send(request);
                        } else {
                            cancelRequest(found, res, "El usuario que ha realizado la peticion no existe o ha eliminado su cuenta.", 404);
                        }
                    })
                } else
                    res.status(403).send({ message: "No tiene permitido realizar esta accion" });
            } else {
                res.status(404).send({ message: "No se han encontrado solicitudes con el ID especificado." });
            }
        });
    } else {
        res.status(400).send({ message: "Debe indicar el id de la solicitud que desea revisar" });
    }
}

function newRequest(req, res) {
    const petitioner = req.user.sub;
    const request = new Request();
    const params = req.body;
    const date = new Date();
    const userId = req.user.sub;

    let productId
    try {
        productId = mongoose.Types.ObjectId(params.productId);
    } catch {
        productId = null;
    }
    if (productId != null && params.message) {
        let productId = params.productId;
        Product.findById(productId, (err, found) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error: 'Error interno del servidor' });
            } else if (found) {
                if (found.ownerId == petitioner) {
                    res.status(403).send({ message: "No puede solicitar su propia donacion." });
                } else if (found.interested.includes(petitioner)) {
                    Request.findOne({ petitionerId: userId, productId: found.id }, (err, foundR) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send({ error: 'Error interno del servidor' });
                        } else if (foundR) {
                            res.status(403).send({ message: "Ya ha realizado una solicitud para esta donacion, con codigo " + found._id });
                        } else {
                            res.status(500).send({ error: "Ha ocurrido un error inesperado" });
                        }
                    })
                } else if (found.available == false) {
                    res.status(403).send({ message: "La donacion a solicitar ya no se encuentra disponible" });
                } else {
                    Request.findOne({ productId: params.productId, approved: true }, (err, foundR) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send({ error: 'Error interno del servidor' });
                        } else if (foundR) {
                            res.status(403).send({ message: "Una solicitud para esta donacion ya se encuentra aprobada, no puede realizar otra solicitud." });
                        } else {
                            request.productId = found._id;
                            request.petitionerId = petitioner;
                            request.ownerId = found.ownerId;
                            request.requestedDate = date;
                            request.message = params.message;
                            request.approved = null;
                            request.confirmed = null;

                            request.save((err, saved) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send({ error: 'Error interno del servidor', err });
                                } else if (saved) {
                                    Product.findByIdAndUpdate(found._id, { $push: { interested: petitioner } }, { new: true }, (err, updated) => {
                                        if (err) {
                                            console.log(err);
                                            cancelRequest(saved, res, "Error interno del servidor", 500);
                                        } else if (updated) {
                                            User.findById(updated.ownerId, (err, foundOwner) => {
                                                if (err) {
                                                    console.log("error del servidor");
                                                } else if (foundOwner) {

                                                    //INFORMACION PARA CORREOS Y NOTIFICACIONES
                                                    /*
                                                    dueno: foundOwner.name + " " + foundOwner.lastname,
                                                    email: foundOwner.email,
                                                    petitioner: req.user.name + " " + req.user.lastname,
                                                    product: updated.name,
                                                    productId: updated._id,
                                                    petitionerPic: req.user.profilePic,
                                                    ownerId: foundOwner._id,
                                                    */

                                                    try {

                                                        const email = new NewRequestEmail({
                                                            ownerName: foundOwner.name + " " + foundOwner.lastname,
                                                            ownerEmail: foundOwner.email,
                                                            applicantName: req.user.name + " " + req.user.lastname,
                                                            productName: updated.name
                                                        });
                                                        email.sendEmail();

                                                        Notifications.sendNewRequestNotification({
                                                            applicantName: req.user.name + " " + req.user.lastname,
                                                            productName: updated.name,
                                                            productId: updated._id,
                                                            applicantProfileImage: req.user.profilePic,
                                                            ownerId: foundOwner._id,

                                                        });

                                                        console.log("Notificacion enviada");

                                                    } catch (ex) {
                                                        console.log("Error al enviar notif nueva solicitud")
                                                    }


                                                } else {
                                                    console.log("No hay informacion para el correo");
                                                }
                                            })



                                            res.send({
                                                "idRequest": saved._id,
                                                "productId": productId,
                                                "petitionerId": petitioner,
                                                "requestedDate": saved.requestedDate,
                                                "messageSent": saved.message,
                                                "approved": (saved.approved == null || saved.approved == undefined) ? "Pendiente" : saved.approved
                                            });
                                        } else {
                                            cancelRequest(saved, res, "Ha ocurrido un problema al agregar la solicitud al registro", 500);
                                        }
                                    });
                                } else {
                                    res.status(418).send({ message: "Ha ocurrido un error al crear la solicitud" });
                                }
                            });
                        }
                    });
                }
            } else {
                res.status(404).send({ message: "No se han encontrado productos con este ID." });
            }
        })
    } else if (!params.productId) {
        res.status(400).send({ message: "Debe indicar el ID del producto a solicitar." });
    } else if (!params.message) {
        res.status(400).send({ message: "Debe introducir el mensaje que desea enviar al donador." });
    } else {
        res.status(400).send({ message: "Debe llenar los campos solicitados." });
    }
}

function rejectRequest(req, res) {
    const params = req.body;
    const userId = req.user.sub;
    let requestID
    try {
        requestID = mongoose.Types.ObjectId(params.requestId);
    } catch {
        requestID = null;
    }
    if (requestID != null) {
        let requestId = params.requestId;
        Request.findById(requestId, (err, found) => {
            if (err) {
                res.status(500).send({ error: "Error interno del servidor", err });
            } else if (found && found != null) {
                if (userId == found.ownerId) {
                    if (found.approved == true) {
                        res.status(403).send({ message: "La solicitud ya se encuentra aprobada, no puede eliminarla" });
                    } else {
                        Request.findByIdAndDelete(found._id, (err, deleted) => {
                            if (err) {
                                res.status(500).send({ error: "Error interno del servidor", err });
                            } else if (deleted) {
                                Product.findByIdAndUpdate(found.productId, { $pull: { interested: found.petitionerId } }, { new: true }, (err, updated) => {
                                    if (err) {
                                        res.status(500).send({ error: "Error interno del servidor", err });
                                    } else if (updated) {
                                        User.findById(deleted.petitionerId, (err, petitioner) => {
                                            if (err) {
                                                console.log("Error del servidor\n", err)
                                            } else if (petitioner) {

                                                //INFORMACION PARA CORREOS Y NOTIFICACIONES

                                                /*
                                                    petitioner: petitioner.name + " " + petitioner.lastname,
                                                    petitionerId: petitioner._id,
                                                    email: petitioner.email,
                                                    product: updated.name,
                                                    productId: updated._id,
                                                    productImages: updated.images
                                                    */


                                                try {

                                                    const email = new RequestRejectedEmail({
                                                        userName: petitioner.name,
                                                        userEmail: petitioner.email,
                                                        productName: updated.name
                                                    });
                                                    email.sendEmail();

                                                    Notifications.sendRequestRejectedNotification({
                                                        productName: updated.name,
                                                        productId: updated._id,
                                                        productImages: updated.images,
                                                        applicantId: petitioner._id
                                                    })



                                                } catch (ex) {

                                                }




                                            } else {
                                                console.log("Sin informacion para el correo");
                                            }
                                        })
                                        res.send({ message: "Solicitud eliminada" });
                                    } else {
                                        res.status(500).send({ message: "Ha ocurrido un error inesperado al eliminar la solicitud" });
                                    }
                                });
                            } else {
                                res.status(500).send({ message: "Ha ocurrido un error inesperado al eliminar la solicitud" });
                            }
                        })
                    }
                } else {
                    res.status(403).send({ message: "No tiene permitido realizar esta accion" });
                }
            } else {
                res.status(404).send({ message: "No se han encontrado solicitudes con el ID indicado." });
            }
        });
    } else {
        res.status(400).send({ message: "Debe ingresar el id de la solicitud que desea rechazar." });
    }
}

function approveRequest(req, res) {

    const params = req.body;
    const userId = req.user.sub;
    let requestID
    try {
        requestID = mongoose.Types.ObjectId(params.requestId);
    } catch {
        requestID = null;
    }
    if (requestID != null) {
        let requestId = params.requestId;
        Request.findById(requestId, (err, found) => {
            if (err) {
                res.status(500).send({ error: "Error interno del servidor", err });
            } else if (found && found != null) {
                if (userId == found.ownerId) {
                    if (found.approved == true) {
                        res.status(403).send({ message: "La solicitud ya se encuentra aprobada." });
                    } else {
                        Request.findByIdAndUpdate(found._id, { approved: true }, { new: true }, (err, updated) => {
                            if (err) {
                                res.status(500).send({ error: "Error interno del servidor", err });
                            } else if (updated) {
                                Product.findByIdAndUpdate(found.productId, { available: false }, { new: true }, (err, found) => {
                                    if (err) {
                                        res.status(500).send({ error: "Error interno del servidor", err });
                                    } else if (found) {

                                        User.findById(updated.petitionerId, (err, foundU) => {
                                            if (err) {
                                                console.log("Error del servidor ", err);
                                            } else if (foundU) {
                                                //DATOS PARA ENVIO DE EMAILS Y NOTIFICACIONES
                                                /* 
                                                product: found.name,
                                                productId: found._id,
                                                productImages: found.images,
                                                petitionerId: foundU._id,
                                                petitionerEmail: foundU.email,
                                                petitioner: foundU.name + " " + foundU.lastname,
                                                owner: req.user.name + " " + req.user.lastname,
                                                ownerEmail: req.user.email
                                                */

                                                try {
                                                    new RequestApprovedEmail({
                                                        userName: foundU.name + " " + foundU.lastname,
                                                        userEmail: foundU.email,
                                                        productName: found.name,
                                                        ownerEmail: req.user.email,
                                                        ownerName: req.user.name + " " + req.user.lastname
                                                    }).sendEmail();

                                                    Notifications.sendRequestApprovedNotification({
                                                        productName: found.name,
                                                        productId: found._id,
                                                        productImages: found.images,
                                                        applicantId: foundU._id
                                                    })
                                                } catch (ex) {
                                                    console.log("Error enviando notif")
                                                }



                                            } else {
                                                console.log("Sin informacion para notificaciones e emails");
                                            }
                                        })




                                        rejectOtherRequests(updated, res);
                                    } else {
                                        res.status(500).send({ message: "Se ha producido un error inesperado al confirmar la solicitud" });
                                    }
                                });
                            } else {
                                res.status(500).send({ message: "Ha ocurrido un error inesperado al aceptar la solicitud" });
                            }
                        })
                    }
                } else {
                    res.status(403).send({ message: "No tiene permitido realizar esta accion" });
                }
            } else {
                res.status(404).send({ message: "No se han encontrado solicitudes con el ID indicado." });
            }
        });
    } else {
        res.status(400).send({ message: "Debe ingresar el id de la solicitud que desea rechazar." });
    }
}

function deleteRequest(req, res) {
    let params = req.body;
    let productId = null;
    let userId = req.user.sub;
    try {
        productId = mongoose.Types.ObjectId(params.productId);
    } catch {
        productId = null;
    }
    if (productId != null) {
        Request.findOne({ $and: [{ petitionerId: userId }, { productId: params.productId }] }, (err, found) => {
            if (err) {
                res.status(500).send({ error: "Error interno del servidor" });
                console.log(err);
            } else if (found) {
                if (found.petitionerId == userId) {
                    if (found.approved == true) {
                        res.status(403).send({ message: "La solicitud ya ha sido aceptada, no puede cancelarla." });
                    } else {
                        Request.findByIdAndDelete(found._id, (err, deleted) => {
                            if (err) {
                                res.status(500).send({ error: "Error interno del servidor" });
                                console.log(err);
                            } else if (deleted) {
                                Product.findByIdAndUpdate(found.productId, { $pull: { interested: found.petitionerId } }, { new: true }, (err, updated) => {
                                    if (err) {
                                        res.status(500).send({ error: "Error interno del servidor", err });
                                    } else if (updated) {
                                        res.send({ message: "Se ha cancelado la solicitud" });
                                    } else {
                                        res.status(500).send({ message: "Ha ocurrido un error inesperado al eliminar la solicitud" });
                                    }
                                });
                            } else {
                                res.status(500).send({ error: "Se ha producido un error inesperado al cancelar la solicitud" });
                            }
                        });
                    }
                } else
                    res.status(403).send({ message: "No tiene permitido realizar esta acci??n" });
            } else {
                res.status(500).send({ error: "No se han encontrado solicitudes al producto con el ID especificado." });
            }
        })
    } else {
        res.status(400).send({ message: "Debe ingresar el id del producto que desea cancelar." });
    }
}

function confirmReceived(req, res) {
    let params = req.body;
    let productId = null;
    let userId = req.user.sub;
    try {
        productId = mongoose.Types.ObjectId(params.productId);
    } catch {
        productId = null;
    }
    if (productId != null) {
        console.log(userId);
        Request.findOne({ $and: [{ productId: params.productId }, { petitionerId: userId }] }, (err, found) => {
            if (err) {
                res.status(500).send({ error: "Error interno del servidor" });
                console.log(err);
            } else if (found) {
                if (userId == found.petitionerId) {

                    Request.findByIdAndUpdate(found._id,{confirmed:true},{new:true},(err,updatedR)=>{
                        if(err){
                            res.status(500).send({ error: "Error interno del servidor", err });
                        }else if(updatedR){
                            User.findByIdAndUpdate(userId, { $push: { adquisitions: found.productId } }, { new: true }, (err, updatedU) => {
                                if (err) {
                                    res.status(500).send({ error: "Error interno del servidor", err });
                                } else if (updatedU) {
                                    Product.findById(productId, (err, foundP) => {
                                        if (err) {
                                            console.log("Error del servidor ", err);
                                        } else if (foundP) {
                                            User.findById(foundP.ownerId, (err, foundOwner) => {
                                                if (err) {
                                                    console.log("Error del servidor ", err);
                                                } else if (foundOwner) {
                                                    //DATOS PARA ENVIO DE EMAILS Y NOTIFICACIONES
                                                    /* 
                                                    product: foundP.name,
                                                    productId: foundP._id,
                                                    productImages: foundP.images,
                                                    ownerId: foundOwner._id,
                                                    petitioner: req.user.name + " " + req.user.lastname,
                                                    owner: foundOwner.name + " " + foundOwner.lastname,
                                                    ownerEmail: foundOwner.email
                                                    */
        
        
                                                    try {
        
                                                        new DonationConfirmedAsReceivedEmail({
                                                            ownerName: foundOwner.name + " " + foundOwner.lastname,
                                                            ownerEmail: foundOwner.email,
                                                            beneficiaryName: req.user.name + " " + req.user.lastname,
                                                            productName: foundP.name
                                                        }).sendEmail();
        
                                                        Notifications.sendDonationConfirmedAsReceivedNotification({
                                                            productName: foundP.name,
                                                            productId: foundP._id,
                                                            productImages: foundP.images,
                                                            ownerId: foundOwner._id,
                                                            applicantName: req.user.name + " " + req.user.lastname
                                                        })
        
                                                    } catch (ex) {
                                                        console.log("error enviando notif ", ex)
                                                    }
        
                                                } else
                                                    console.log("Sin informacion para emails y notificaciones");
                                            });
                                        } else {
                                            console.log("Sin informacion para emails y correos");
                                        }
                                    })
        
                                    res.send({ message: "Se ha informado al due??o que ha aceptado la donaci??n. Producto agregado a su registro." });
                                } else {
                                    res.status(500).send({ message: "Se ha producido un error inesperado al confirmar la donaci??n" });
                                }
                            })
                        }else{
                            res.status(500).send({ message: "Se ha producido un error inesperado al confirmar la donaci??n" });
                        }
                    })
                } else
                    res.status(403).send({ message: "No tiene permitido realizar esta acci??n" });
            } else {
                res.status(500).send({ error: "No se han encontrado solicitudes realizadas al producto con el ID especificado" });
            }
        })
    } else {
        res.status(400).send({ message: "Debe ingresar el id de la donaci??n a confirmar." });
    }
}

function rejectDonation(req, res) {
    let params = req.body;
    let userId = req.user.sub;
    let productId = null;
    try {
        productId = mongoose.Types.ObjectId(params.productId);
    } catch {
        productId = null;
    }
    if (productId != null) {
        Request.findOne({ $and: [{ productId: params.productId }, { petitionerId: userId }] }, (err, found) => {
            if (err) {
                res.status(500).send({ error: "Error interno del servidor" });
                console.log(err);
            } else if (found) {
                if (userId == found.petitionerId) {

                    Request.findByIdAndDelete(found._id, (err, deleted) => {
                        if (err) {
                            res.status(500).send({ error: "Error interno del servidor" });
                            console.log(err);
                        } else if (deleted) {
                            Product.findByIdAndUpdate(found.productId, { available: true, $pull: { interested: found.petitionerId } }, { new: true }, (err, updated) => {
                                if (err) {
                                    res.status(500).send({ error: "Error interno del servidor", err });
                                } else if (updated) {

                                    User.findById(updated.ownerId, (err, foundOwner) => {
                                        if (err) {
                                            console.log("Error del servidor ", err);
                                        } else if (foundOwner) {
                                            //DATOS PARA ENVIO DE EMAILS Y NOTIFICACIONES
                                            /* 
                                            product: updated.name,
                                            productId: updated._id,
                                            productImages: updated.images,
                                            ownerId: foundOwner._id,
                                            petitioner: req.user.name + " " + req.user.lastname,
                                            owner: foundOwner.name + " " + foundOwner.lastname,
                                            ownerEmail: foundOwner.email
                                            */

                                            try {

                                                new DonationRejectedByBeneficiaryEmail({
                                                    ownerName: foundOwner.name + " " + foundOwner.lastname,
                                                    ownerEmail: foundOwner.email,
                                                    beneficiaryName: req.user.name + " " + req.user.lastname,
                                                    productName: updated.name
                                                })


                                                Notifications.sendDonationRejectedByBeneficiaryNotification({
                                                    productName: updated.name,
                                                    productId: updated._id,
                                                    productImages: updated.images,
                                                    ownerId: foundOwner._id,
                                                    applicantName: req.user.name + " " + req.user.lastname
                                                })

                                            } catch (ex) {
                                                console.log("error enviando notif ", ex)
                                            }



                                        } else
                                            console.log("Sin informacion para emails y notificaciones");
                                    });

                                    res.send({ message: "Se ha rechazado la donacion" });
                                } else {
                                    res.status(500).send({ message: "Ha ocurrido un error inesperado al eliminar la solicitud" });
                                }
                            });
                        } else {
                            res.status(500).send({ error: "Se ha producido un error inesperado al rechazar la donacion" });
                        }
                    });
                } else
                    res.status(403).send({ message: "No tiene permitido realizar esta acci??n" });
            } else {
                res.status(500).send({ error: "No se han encontrado solicitudes realizadas al producto con el ID especificado" });
            }
        })
    } else {
        res.status(400).send({ message: "Debe ingresar el id de la donaci??n que desea rechazar." });
    }
}

function rejectOtherRequests(request, res) {
    Request.updateMany({ productId: request.productId, _id: { $ne: request._id } }, { approved: false }, { new: true }, (err, updated) => {
        if (err) {
            res.status(500).send({ error: "Error interno del servidor", err });
        } else if (updated) {
            res.send({ message: "Solicitud aprobada con exito." });
        } else {
            res.status(500).send({ error: "Solicitud aceptada, ha ocurrido un error inesperado al rechazar las otras solicitudes a esta donacion." })
        }
    })
}

function cancelRequest(request, res, message, status) {
    Request.findByIdAndDelete(request._id, (err, deleted) => {
        if (err) {
            res.status(500).send({ error: 'Error interno del servidor' });
            console.log(err);
        } else if (deleted) {
            res.status(status).send({ error: message });
        } else {
            res.status(400).send({ error: 'Ha ocurrido un problema al enviar la solicitud al usuario que la ha realizado, la solicitud fue realizada pero inhabilitada.' });
        }
    });
}

module.exports = {
    getRequest,
    newRequest,
    rejectRequest,
    approveRequest,
    deleteRequest,
    confirmReceived,
    rejectDonation
}