'use strict'

var express = require('express');
var productController = require('../controllers/product.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/addProduct/:idU', mdAuth.ensureAuth, productController.addProduct);
api.get('/listProducts', productController.listProducts);
api.get('/nextList', productController.nextList);

module.exports = api;