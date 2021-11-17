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
    profilePic:String,
    dpiPics: [],
    sex: String,
    birth: Date,
    adquisitions: [{ type: Schema.Types.ObjectId, ref: 'product' }],
    donations: [{ type: Schema.Types.ObjectId, ref: 'product' }]
});

module.exports = mongoose.model('user', userSchema);