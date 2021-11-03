'use strict'

const express = require('express');
const requestController = require('../controllers/request.controller');
const mdAuth = require('../middlewares/authenticated');

const api = express.Router();

api.post('/newRequest',mdAuth.ensureAuth,requestController.newRequest);
api.post('/getRequest',mdAuth.ensureAuth, requestController.getRequest);
api.post('/rejectRequest',mdAuth.ensureAuth, requestController.rejectRequest);
api.post('/approveRequest',mdAuth.ensureAuth, requestController.approveRequest);
api.delete('/deleteRequest',mdAuth.ensureAuth, requestController.deleteRequest)

module.exports = api;