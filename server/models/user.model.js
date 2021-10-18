'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = Schema({
    dpi: Number,
    username: String,
    email:String,
    password:String,
    name: String,
    lastname: String,
    age: Number,
    address: String,
    urlImage:String,
    sex: String,
    birth: Date,
    adquisitions: [{ type: Schema.Types.ObjectId, ref: 'buy' }],
    donations: [{ type: Schema.Types.ObjectId, ref: 'product' }]
});

module.exports = mongoose.model('user', userSchema);