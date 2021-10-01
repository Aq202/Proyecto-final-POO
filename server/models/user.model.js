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
    direction: String,
    urlImagen:String,
    sex: String,
    birth: String,
    adquisitions: [{ type: Schema.Types.ObjectId, ref: 'buy' }],
    donations: [{ type: Schema.Types.ObjectId, ref: 'product' }]
});

module.exports = mongoose.model('user', userSchema);