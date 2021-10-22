'use strict'

const express = require('express');
const userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');
var api = express.Router();

api.post('/signIn', userController.signIn);
api.post('/login', userController.login);

module.exports = api;