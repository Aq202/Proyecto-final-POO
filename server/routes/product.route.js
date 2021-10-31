'use strict'

var express = require('express');
var productController = require('../controllers/product.controller');
var mdAuth = require('../middlewares/authenticated');
const multer = require('../services/multer');


var api = express.Router();


api.post('/addProduct', mdAuth.ensureAuth, multer.any(), productController.addProduct);
api.post('/listProducts', productController.listProducts);
api.post('/filteredSearch', productController.filteredSearch);

module.exports = api;