'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const requestSchema = Schema({
    productId: String,
    petitionerId: String,
    requestedDate:Date,
    ownerId: String,
    message:String,
    approved: Boolean,
    confirmed: Boolean
});

module.exports = mongoose.model('request', requestSchema);