'use strict'

const User = require('../models/user.model');
const Product = require('../models/product.model');
const Request = require('../models/request.model');
const mongoose = require('mongoose');

function requestAccepted(productId, userId=null){
    if(userId != null){
        Request.findOne({productId:productId, petitionerId:userId, aprovved: true},(err,found)=>{
            if(err){
                console.log(err);
                return false;
            }else if(found){
                return true;
            }else{
                return false;
            }
        });
    }else{
        Request.findOne({productId:productId, aprovved: true},(err,found)=>{
            if(err){
                console.log(err);
                return false;
            }else if(found){
                return true;
            }else{
                return false;
            }
        });
    }
}

function getProduct(req, res) {
    const params = req.body;
    if (params.productId) {
        let productId = params.productId;
        Product.findById(productId, (err, found) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error: 'Error interno del servidor', err });
            } else if (found) {
                if(req.user != null && found.ownerId == req.user.sub){
                    res.send({
                        "Product found": found._id,
                        "Cathegory": found.cathegory,
                        "Department": found.department,
                        "Municipality": found.municipality,
                        "Images": found.images,
                        "Owner profile picture": found.ownerProfilePic,
                        "Owner": found.owner,
                        "Owner ID": found.ownerId,
                        "Product description": found.description,
                        "isOwner": true,
                        "donationRequestAccepted": requestAccepted(found._id),
                        "donationReceivedConfirmed": (found.available == false) ? true : false
                    });    
                } else {
                    res.send({
                        "Product found": found._id,
                        "Cathegory": found.cathegory,
                        "Department": found.department,
                        "Municipality": found.municipality,
                        "Images": found.images,
                        "Owner profile picture": found.ownerProfilePic,
                        "Owner": found.owner,
                        "Owner ID": found.ownerId,
                        "Product description": found.description,
                        "alreadyRequested": found.interested.includes(req.user.sub),
                        "selectedAsBeneficiary": requestAccepted(found._id, req.user.sub)
                    });
                }
            } else {
                res.status(404).send({ error: "No se han encontrado productos con el ID indcado" });
            }
        });
    } else {
        res.status(400).send({ message: "Indique el ID del producto que desea ver con detalle." });
    }
}

function addProduct(req, res) {
    var userId = req.user.sub;
    var product = new Product();
    var params = req.body;
    const date = new Date();
    date.setTime(date.getTime() - (6 * 60 * 60 * 1000));

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
            for(let i = 2; i < imageArray.length; i++ ){

                image += imageArray[i]
                if(i !== (imageArray.length - 1))  image += "/";
            }
            images.push(image);
        });
        product.images = images;

        product.save((err, saved) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error: 'Error interno del servidor', err });
            } else if (saved) {
                User.findByIdAndUpdate(userId, { $push: { donations: saved._id } }, { new:true }, (err, updated) => {
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

function updateOwner(product, user, res){
    Product.findByIdAndUpdate(product._id, { owner : user.name + ' ' + user.lastname, ownerProfilePic: user.profilePic }, { new : true }, (err, updated) => {
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
    let params = req.body;
    let skipped = params.skip ? parseInt(params.skip) : 0;
    let quantity = params.quantity ? parseInt(params.quantity) : 10;
    let order = (params.ascending && params.ascending == "true") ? 1 : -1;
    Product.find({}, (err, found) => {
        if (err) {
            res.status(500).send({ error: 'Error interno del servidor', err });
        } else if (found && found.length > 0) {
            res.send({ 'Productos disponibles': found });
        } else {
            res.status(404).send({ message: 'No hay datos para mostrar' });
        }
    }).skip(skipped).limit(quantity).sort({ publishDate: order });
}

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
    console.log(instruction)
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

module.exports = {
    addProduct,
    listProducts,
    filteredSearch,
    getProduct
}