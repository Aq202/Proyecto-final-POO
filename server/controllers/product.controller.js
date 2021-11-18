'use strict'

const User = require('../models/user.model');
const Product = require('../models/product.model');
const Request = require('../models/request.model');
const mongoose = require('mongoose');

function getCurrentRequests(req, res) {
    let params = req.body;
    let userId = req.user.sub;
    let productID;
    try {
        productID = mongoose.Types.ObjectId(params.productId);
    } catch {
        productID = null;
    }
    if (productID != null && params.productId && params.productId != null && params.productId != "") {
        Product.findById(params.productId, (err, found) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error: "Error interno del servidor." });
            } else if (found) {
                if (found.ownerId == userId) {
                    Request.find({ productId: params.productId }, (err, foundR) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send({ error: "Error interno del servidor." });
                        } else if (foundR) {
                            let currentRequests = [];
                            for (let index in foundR) {
                                const request = foundR[index];
                                try {
                                    User.findById(request.petitionerId, (err, foundU) => {
                                        if(err) throw "";
                                        if (foundU && foundU != null) {
                                            currentRequests.push({
                                                request: request._id,
                                                petitioner: (foundU.name + " " + foundU.lastname),
                                                profilePicture: foundU.profilePic,
                                                requestedDate: request.requestedDate,
                                                approved: (request.approved == true ? request.approved : false)
                                            });
                                        }
                                        if(index == (foundR.length - 1)){   
                                            res.send({ currentRequests });
                                        }
                                    })
                                }
                                catch (ex) {
                                    console.log("ERROR MANUAL ",ex);
                                    res.send(500).send({message:"Ocurrió un error interno"});

                                }
                            }

                            
                        } else {
                            res.status(404).send({ message: "Actualmente no hay solicitudes para esta donacion" });
                        }
                    })
                } else {
                    res.status(403).send({ message: "No tiene permitido realizar esta accion" });
                }
            } else {
                res.status(404).send({ message: "No se han encontrado productos con el ID especificado" });
            }
        })
    } else {
        res.status(400).send({ message: "Debe ingresar el ID del producto del que desea obtener las solicitudes actuales." });
    }
}

function getProduct(req, res) {
    const params = req.body;
    let productId
    try {
        productId = mongoose.Types.ObjectId(params.productId);
    } catch {
        productId = null;
    }
    if (productId != null) {
        Product.findById(productId, (err, found) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error: 'Error interno del servidor', err });
            } else if (found) {
                let message = '{"ProductFoundId": "' + found._id + '",';
                message += '"Cathegory": "' + found.cathegory + '",';
                message += '"Department": "' + found.department + '",';
                message += '"Municipality": "' + found.municipality + '",';
                if (found.ownerProfilePic) message += '"OwnerProfilePicture": "' + found.ownerProfilePic + '",';
                if (found.images && found.images != null && found.images != undefined && found.images.length > 0) {
                    message += '"Images": [';
                    let contador = 0
                    found.images.forEach(image => {
                        if (contador == found.images.length - 1)
                            message += '"' + image + '"';
                        else
                            message += '"' + image + '",';
                        contador++;
                    });
                    message += '],';
                }
                if (found.ownerProfilePic && found.ownerProfilePic != null && found.ownerProfilePic != undefined)
                    message += '"OwnerProfilePicture": "' + found.ownerProfilePic + '",';
                message += '"Owner": "' + found.owner + '",';
                message += '"OwnerID": "' + found.ownerId + '",';
                message += '"ProductName": "' + found.name + '",';
                message += '"ProductDescription": "' + found.description + '",';
                message += '"Available": ' + found.available + '';
                if (req.user != null && found.ownerId == req.user.sub) {
                    message += ',"isOwner": ' + true + '';
                    Request.findOne({ productId: productId, approved: true }, (err, foundR) => {
                        if (foundR) {
                            message += ',"donationRequestAccepted": ' + true + ',';
                            message += '"donationReceivedConfirmed": ' + (found.available == false ? true : false) + '';
                        }else{
                            message += ',"donationRequestAccepted": ' + false + ',';
                            message += '"donationReceivedConfirmed": ' + false + '';
                        }
                        message += '}';
                        console.log(message);
                        res.send(JSON.parse(message));
                    });

                } else if (req.user != null && req.user != undefined) {
                    Request.findOne({ productId: productId, petitionerId: req.user.sub, approved: true }, (err, foundR) => {
                        if (foundR) {
                            message += ',"selectedAsBeneficiary": ' +  true  + '';
                        }else{
                            message += ',"selectedAsBeneficiary": ' +  false  + '';
                        }
                        if(found.interested && found.interested != null && found.interested != undefined && found.interested.length>0)
                            message += ',"alreadyRequested": ' + (found.interested.includes(req.user.sub) == true ? true : false);
                        else
                            message += ',"alreadyRequested": ' + false;
                        User.findById(req.user.sub, (err,foundU)=>{
                            if(foundU && foundU != null && foundU != undefined){
                                if(foundU.adquisitions && foundU.adquisitions != null && foundU.adquisitions != undefined && foundU.adquisitions.length>0)
                                    message += ',"donationReceivedConfirmed": ' + (foundU.adquisitions.includes(found._id) == true ? true : false);    
                                else
                                    message += ',"donationReceivedConfirmed": ' +  false;    
                            }else if(err)
                                console.log(err);
                            Request.findOne({ productId: productId, approved: true }, (err, foundR) => {
                                if (foundR) {
                                    message += ',"donationRequestAccepted": ' + true ;
                                }else{
                                    message += ',"donationRequestAccepted": ' + false ;
                                }
                                message += '}';
                                console.log(message);
                                res.send(JSON.parse(message));
                            });
                        })
                    });
                }else{
                    Request.findOne({ productId: productId, approved: true }, (err, foundR) => {
                        if (foundR) {
                            message += ',"donationRequestAccepted": ' + true ;
                        }else{
                            message += ',"donationRequestAccepted": ' + false ;
                        }
                        message += '}';
                        console.log(message);
                        res.send(JSON.parse(message));
                    });
                }
            } else {
                res.status(404).send({ error: "No se han encontrado productos con el ID indcado" });
            }
        });
    } else {
        res.status(400).send({ message: "Indique el ID del producto que desea ver de forma detallada" });
    }
}

function addProduct(req, res) {
    var userId = req.user.sub;
    var product = new Product();
    var params = req.body;
    const date = new Date();

    if (params.name && params.cathegory && params.department && params.municipality && params.description && req.imagesUrl) {
        product.name = params.name;
        product.description = params.description && params.description != null ? params.description : "Sin descripción";
        product.available = true;
        product.publishDate = date;
        product.cathegory = params.cathegory;
        product.department = params.department;
        product.municipality = params.municipality;
        product.ownerId = userId;
        let images = []
        req.imagesUrl.forEach(image => {
            let imageArray = image.split('/');
            image = "";
            for (let i = 2; i < imageArray.length; i++) {

                image += imageArray[i]
                if (i !== (imageArray.length - 1)) image += "/";

            }
            images.push(image);
        });
        product.images = images;

        product.save((err, saved) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error: 'Error interno del servidor', err });
            } else if (saved) {
                User.findByIdAndUpdate(userId, { $push: { donations: saved._id } }, { new: true }, (err, updated) => {
                    if (err) {
                        console.log(err);
                        cancelDonation(saved, res, "Error interno del servidor", 500);
                    } else if (updated) {
                        setTimeout(() => {
                            updateOwner(saved, updated, res);

                        }, 500);
                    } else {
                        cancelDonation(saved, res, "Ha ocurrido un error al agregar la donacion al registro del usuario.", 500);
                    }
                })
            } else {
                res.status(400).send({ message: 'No ha sido posible realizar la donación.' });
            }
        });
    } else {
        res.status(400).send({ message: 'Debe ingresar todos los datos requeridos.' });
    }
}

function updateOwner(product, user, res) {

    Product.findByIdAndUpdate(product._id, { owner: user.name + ' ' + user.lastname }, { new: true }, (err, updated) => {
        if (err) {
            cancelDonation(product, res, "Error interno del servidor", 500);
        } else if (updated) {
            res.send({ message: 'Producto agregado con éxito.', data: updated });
        } else {
            cancelDonation(product, res, "Ha ocurrido un error al asignar la donación al usuario correspondiente.", 500);
        }
    });
}

function cancelDonation(product, res, message, status) {
    Product.findByIdAndDelete(product._id, (err, deleted) => {
        if (err) {
            res.status(500).send({ error: 'Error interno del servidor', err });
        } else if (deleted) {
            res.status(status).send({ error: message });
        } else {
            res.status(400).send({ error: 'Ha ocurrido un problema al asignar la donación al usuario correspondiente; la donación fue realizada pero inhabilitada.' });
        }
    });
}

function listProducts(req, res) {
    /*let params = req.body;
    let skipped = params.skip ? parseInt(params.skip) : 0;
    let quantity = params.quantity ? parseInt(params.quantity) : 10;
    let order = (params.ascending && params.ascending == "true") ? 1 : -1;
    Product.find({}, (err, found) => {
        if (err) {
            res.status(500).send({ error: 'Error interno del servidor', err });
        } else if (found && found.length > 0) {
            let products = [];
            if(found.donations && found.donations != null && found.donations != undefined){
                found.donations.foreach(donation=>{
                    products.push({_id: donation});
                })
            if(found.donations && found.donations != null && found.donations != undefined){
                found.donations.foreach(donation=>{
                    products.push({_id: donation});
                })
            }
        } else {
            res.status(404).send({ message: 'No hay datos para mostrar' });
        }
    }).skip(skipped).limit(quantity).sort({ publishDate: order });
*/}

function filteredSearch(req, res) {
    let params = req.body;
    let skipped = params.skip ? parseInt(params.skip) : 0;
    let quantity = params.quantity ? parseInt(params.quantity) : 10;
    let order = (params.ascending && params.ascending == "true") ? 1 : -1;
    let instruction = '{';
    if (params.department) {
        if (instruction[1] != undefined)
            instruction += ', ';
        instruction += '"department": "' + params.department + '"';
    }
    if (params.municipality) {
        if (instruction[1] != undefined)
            instruction += ', ';
        instruction += '"municipality": "' + params.municipality + '"';
    }
    if (params.search) {
        if (instruction[1] != undefined)
            instruction += ', ';
        instruction += '"$or": [{ "name": { "$regex":"' + params.search + '", "$options": "\'i\'"}}, { "description": { "$regex":"' + params.search + '", "$options": "\'i\'"} }]';
    }
    if (params.cathegory !== undefined && params.cathegory != null && params.cathegory.length > 0) {

        if (instruction[1] != undefined)
            instruction += ', ';
        instruction += '"$or": [';

        const cathegories = params.cathegory;

        let contador = 0;
        cathegories.forEach(category => {
            if (contador > 0 && contador < cathegories.length)
                instruction += ', ';
            instruction += '{"cathegory": "' + category + '"}';
            contador++;
        });
        instruction += ']';


    }
    instruction += '}';
    Product.find(JSON.parse(instruction), (err, found) => {
        if (err) {
            res.status(500).send({ error: 'Error interno del servidor', err });
        } else if (found && found.length > 0) {
            res.send({ products: found });
        } else {
            res.status(404).send({ message: "No se han encontrado resultados para la búsqueda." });
        }
    }).skip(skipped).limit(quantity).sort({ publishDate: order });
}

function deleteProduct(req, res) {
    var userId = req.user.sub;
    var params = req.body;

    let productId
    try {
        productId = mongoose.Types.ObjectId(params.productId);
    } catch {
        productId = null;
    }
    if (productId != null) {
        Product.findById(params.productId, (err, found) => {
            if (err) {
                res.status(500).send({ error: 'Error interno del servidor', err });
            } else if (found && found != null && found != undefined) {
                if (found.ownerId == userId) {

                    Request.findOne({productId : found._id, approved: true},(err, foundR)=>{
                        if(err){
                            res.status(500).send({ error: 'Error interno del servidor', err });
                        }else if(foundR){
                            res.status(403).send({message:"Ya ha aceptado una solicitud para donar este producto, por lo tanto no puede eliminarlo"});
                        }else{
                            Product.findByIdAndDelete(found._id, (err, deleted) => {
                                if (err) {
                                    res.status(500).send({ error: 'Error interno del servidor', err });
                                } else if (deleted) {
                                    User.findByIdAndUpdate(userId, { $pull: { donations: deleted._id } }, { new: true }, (err, updated) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(500).send({ error: 'Error interno del servidor', err });
                                        } else if (updated) {
                                            res.send({ message: "Producto eliminado con exito." });
                                        } else {
                                            res.status(500).send({ error: "Se ha producido un error al eliminar el producto" });
                                        }
                                    })
                                } else {
                                    res.status(500).send({ error: "Ha ocurrido un error al eliminar el producto indicado" });
                                }
                            })
                        }
                    })
                } else {
                    res.status(403).send({ message: "No tiene permitido realizar esta acción" });
                }
            } else {
                res.status(404).send({ message: "No se han encontrado productos con el ID indicado." });
            }
        })
    } else {
        res.status(400).send({ message: "Ingrese el ID del producto que desea eliminar." });
    }
}

module.exports = {
    addProduct,
    listProducts,
    filteredSearch,
    getProduct,
    deleteProduct,
    getCurrentRequests
}