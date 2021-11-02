'use strict'

var express = require('express');
var productController = require('../controllers/product.controller');
var mdAuth = require('../middlewares/authenticated');
var dp = require('../middlewares/definepath');
const multer = require('../services/multer');


var api = express.Router();

api.use(dp.pathProducts);
api.post('/infoProduct',mdAuth.ensureAuth, productController.getProduct);
api.post('/addProduct', mdAuth.ensureAuth, multer.any(), productController.addProduct);
api.post('/listProducts', productController.listProducts);
api.post('/filteredSearch', productController.filteredSearch);

module.exports = api;