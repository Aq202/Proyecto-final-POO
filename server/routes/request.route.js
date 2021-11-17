'use strict'

const express = require('express');
const requestController = require('../controllers/request.controller');
const mdAuth = require('../middlewares/authenticated');

const api = express.Router();

api.post('/getRequest',mdAuth.ensureAuth, requestController.getRequest);
api.post('/newRequest',mdAuth.ensureAuth,requestController.newRequest);
api.post('/rejectRequest',mdAuth.ensureAuth, requestController.rejectRequest);
api.post('/approveRequest',mdAuth.ensureAuth, requestController.approveRequest);
api.post('/cancelRequest',mdAuth.ensureAuth, requestController.deleteRequest);
api.post('/confirmReceived',mdAuth.ensureAuth, requestController.confirmReceived);
api.post('/rejectDonation',mdAuth.ensureAuth, requestController.rejectDonation);

module.exports = api;