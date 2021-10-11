'use strict'

const User = require('../models/user.model');
const Product = require('../models/product.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function addProduct(req, res) {
    var userId = req.params.idU;
    var product = new Product();
    var params = req.body;

    if (params.name && params.available && params.cathegory) {
        product.name = params.name;
        product.available = params.available == "true" ? true: false;
        product.cathegory = params.cathegory;
        product.publishDate = new Date();
        product.owner = params.idU;

        product.save((err, saved) => {
            if (err) {
                res.status(500).send({ error: 'Error interno del servidor', err });
            } else if (saved) {
                User.findByIdAndUpdate(userId, {$push: {donations: saved._id} }, {new:true}, (err, updated)=>{
                    if (err) {
                        res.status(500).send({ error: 'Error interno del servidor', err });
                    } else if (updated) {
                        res.send({ 'Producto agregado con éxito.': saved });
                    } else {
                        res.send({ '¡ADVERTENCIA!': 'Ha ocurrido un problema al asignar el producto con el usuario indicado'});
                    }  
                })
            } else {
                res.status(400).send({ message: 'No ha sido posible guardar el producto.' });
            }
        });
    } else {
        res.status(400).send({ message: 'Debe ingresar todos los datos requeridos.' })
    }
}

function listProducts(req, res) {
    let params = req.body;
    let quantity = 10;
    quantity = params.quantity ? params.quantity : 10;
    Product.find({}, (err, found) => {
        if (err) {
            res.status(500).send({ error: 'Error interno del servidor', err });
        } else if (found) {
            res.send({ 'Productos disponibles': found });
        } else {
            res.status(404).send({ message: 'No hay datos para mostrar' });
        }
    }).limit(0,quantity);
}

function nextList(req,res){
    let params = req.body;
    let init = 0;
    let quantity = 10;
    quanity = params.quantity ? params.quantity : 10;
    if(params.listed){
        Product.find({}, (err,found)=>{
            if (err) {
                res.status(500).send({ error: 'Error interno del servidor', err });
            } else if (found) {
                res.send({ 'Productos disponibles': found });
            } else {
                res.status(404).send({ message: 'No hay datos para mostrar' });
            }
        }).limit(params.listed, quantity);
    }else{
        listProducts(req,res);
    }
}

function filteredSearch(req,res){
    let params = req.body;
    let quantity = params.quantity ? params.quatity : 10;
    let product = new Product();
    /*let department = params.department != null ? params.department : '';
    let municipality = '';
    let search = '';
    let*/
    if(params.department){
        if(params.municipality){
            product.find({$and: [{ department: params.department }, { municipality: params.municipality }] }, (err, found)=>{
                if (err) {
                    res.status(500).send({ error: 'Error interno del servidor', err });
                } else if (found) {
                    res.send({ 'Productos disponibles': found });
                }
            }).limit(0,quantity);
        }else{
            product.find({department : params.department}, (err, found)=>{
                if (err) {
                    res.status(500).send({ error: 'Error interno del servidor', err });
                } else if (found) {
                    res.send({ 'Productos disponibles': found });
                    matches++;
                }
            }).limit(0,quantity);
        }
    }
}

module.exports={
    addProduct,
    listProducts,
    nextList
}