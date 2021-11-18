'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = Schema({
    userId: String,
    title: String,
    text: String,
    image: String,
    date: Date,
    viewed: Boolean,
    url: String,
});

module.exports = mongoose.model('notification', notificationSchema);