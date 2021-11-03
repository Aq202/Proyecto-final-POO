'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requestSchema = Schema({
    productId: String,
    petitionerId: String,
    requestedDate:Date,
    message:String,
    approved: Boolean
});

module.exports = mongoose.model('request', requestSchema);