'use strict'

const express = require('express');
const userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');
var dp = require('../middlewares/definepath')
var api = express.Router();
const multer = require('../services/multer');

api.use(dp.pathUsers);
api.get('/getUser',mdAuth.ensureAuth, userController.getInfoUser);
api.post('/addPicture', mdAuth.ensureAuth, multer.any(), userController.addProfilePicture);
api.post('/signIn', userController.signIn);
api.post('/login', userController.login);

module.exports = api;