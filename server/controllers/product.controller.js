'use strict'

const User = require('../models/user.model');
const Product = require('../models/product.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function addProduct(req, res) {
    var userId = req.user.sub;
    var product = new Product();
    var params = req.body;
    if (params.name && params.cathegory && params.department && params.municipality && params.description) {
        product.name = params.name;
        product.description = params.description && params.description != null ? params.description : "Sin descripción";
        product.available = true;
        product.publishDate = Date.now();
        product.cathegory = params.cathegory;
        product.department = params.department;
        product.municipality = params.municipality;
        product.urlImage = params.urlImage && params.urlImage != null ? params.urlImage : null;
        product.ownerId = userId;

        product.save((err, saved) => {
            if (err) {
                res.status(500).send({ error: 'Error interno del servidor', err });
            } else if (saved) {
                User.findByIdAndUpdate(userId, {$push: {donations: saved._id} }, {new:true}, (err, updated)=>{
                    if (err) {
                        res.status(500).send({ error: 'Error interno del servidor', err });
                        deleteProduct(saved._id);
                    } else if (updated) {
                        updateOwner(saved, updated, res);
                    } else {
                        cancelDonation(saved, res);
                    }  
                })
            } else {
                res.status(400).send({ message: 'No ha sido posible realizar la donación.' });
            }
        });
    } else {
        res.status(400).send({ message: 'Debe ingresar todos los datos requeridos.' })
    }
}

function updateOwner(product, user, res){
    Product.findByIdAndUpdate(product._id, {owner : user.name + ' ' + user.lastname}, {new : true}, (err, updated)=>{
        if(err){
            cancelDonation(product, res);
        }else if(updated){
            res.send({ 'Producto agregado con éxito.': updated });
        }else{
            cancelDonation(product, res);
        }
    });
}

function cancelDonation(product, res){
    Product.findByIdAndDelete(product._id, (err, deleted)=>{
        if(err){
            res.status(500).send({ error: 'Error interno del servidor', err });
        }else if(deleted){
            res.send({ error: 'Ha ocurrido un problema al asignar la donación al usuario correspondiente, se ha cancelado la donación.'});
        }else{
            res.status(400).send({error: 'Ha ocurrido un problema al asignar la donación al usuairo correspondiente; la donación fue realizada pero inhabilitada.'});
        }
    });
}

function listProducts(req, res) {
    let params = req.body;
    let skipped = params.skip ? parseInt(params.skip) : 0;
    let quantity = params.quantity ? parseInt(params.quantity) : 10;
    Product.find({}, (err, found) => {
        if (err) {
            res.status(500).send({ error: 'Error interno del servidor', err });
        } else if (found && found.length>0) {
            res.send({ 'Productos disponibles': found });
        } else {
            res.status(404).send({ message: 'No hay datos para mostrar' });
        }
    }).skip(skipped).limit(quantity);
}

function filteredSearch(req,res){
    let params = req.body;
    let skipped = params.skip ? parseInt(params.skip) : 0;
    let quantity = params.quantity ? parseInt(params.quantity) : 10;
    let instruction = '{';
    if(params.department){
        if(instruction[1]!=undefined)
                instruction += ', ';
        instruction += '"department": "'+params.department+'"';
    }
    if(params.municipality){
        if(instruction[1]!=undefined)
            instruction += ', ';
        instruction += '"municipality": "'+params.municipality+'"';
    }
    if(params.search){
        if(instruction[1]!=undefined)
            instruction += ', ';
        instruction += '"$or": [{ "name": { "$regex":"'+params.search+'", "$options": "\'i\'"}}, { "description": { "$regex":"'+params.search+'", "$options": "\'i\'"} }]';
    }
    if(params.cathegory){
        if(instruction[1]!=undefined)
            instruction += ', ';
        instruction += '"$or": [';
        let cathegories = params.cathegory.replace(/[\[\]]+/g, '').split(',');
        let contador = 0;
        cathegories.forEach(category=>{
            if(contador>0 && contador < cathegories.length)
                instruction += ', ';
            instruction += '{"cathegory": "'+category+'"}';
            contador++;
        });
        instruction += ']';
    }
    instruction += '}';
    Product.find(JSON.parse(instruction)/*{department:params.department, municipality:params.municipality}*/, (err, found)=>{
        if (err) {
            res.status(500).send({ error: 'Error interno del servidor', err });
        } else if (found && found.length>0) {
            res.send({ 'Productos disponibles': found });
        }else{
            res.status(404).send({ message: "No se han encontrado resultados para la búsqueda." });
        }
    }).skip(skipped).limit(quantity);
}

module.exports={
    addProduct,
    listProducts,
    filteredSearch
}