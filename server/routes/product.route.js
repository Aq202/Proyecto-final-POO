'use strict'

var express = require('express');
var productController = require('../controllers/product.controller');
var mdAuth = require('../middlewares/authenticated');
var dp = require('../middlewares/definepath');
const multer = require('../services/multer');


var api = express.Router();

api.use(dp.pathProducts);
api.post('/getProduct',mdAuth.choicelyAuth, productController.getProduct);
api.post('/addProduct', mdAuth.ensureAuth, multer.any(), productController.addProduct);
api.post('/listProducts', productController.listProducts);
api.post('/filteredSearch', productController.filteredSearch);
api.delete('/cancelDonation',mdAuth.ensureAuth, productController.deleteProduct);
api.post('/currentRequest', mdAuth.ensureAuth, productController.getCurrentRequests);

module.exports = api;