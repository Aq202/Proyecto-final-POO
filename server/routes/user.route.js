'use strict'

const express = require('express');
const userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');
var dp = require('../middlewares/definepath')
var api = express.Router();
const multer = require('../services/multer');

api.use(dp.pathUser);
api.post('/login', userController.login);
api.get('/getUser',mdAuth.ensureAuth, userController.getInfoUser);
api.post('/signIn', multer.any(), userController.signIn);
api.post('/getUserProducts', userController.getUserProducts);
module.exports = api;