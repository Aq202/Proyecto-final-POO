'use strict'

var express = require('express');
var notificationController = require('../controllers/notification.controller');
var mdAuth = require('../middlewares/authenticated');
var dp = require('../middlewares/definepath');
const multer = require('../services/multer');


var api = express.Router();

api.use(dp.pathNotifications);
api.post('/saveNotification', multer.any(), notificationController.saveNotification);
api.post('/setAsViewed', mdAuth.ensureAuth, notificationController.setAsViewed);
api.delete('/deleteNotification', mdAuth.ensureAuth, notificationController.deleteNotification);
api.post('/setAllAsViewed', mdAuth.ensureAuth, notificationController.setAllNotificationsAsViewed);
api.delete('/deleteAllNotifications',mdAuth.ensureAuth, notificationController.deleteAllNotifications);

module.exports = api;