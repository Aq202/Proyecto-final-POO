'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = Schema({
    name: String,
    available: Boolean,
    type: String,
    publishDate: Date,
    owner: String,
    cathegory: String,
    department: String,
    municipality: String,
    urlImagen:String,
    interested: [{ type: Schema.Types.ObjectId, ref: 'user' }]
});

module.exports = mongoose.model('product', productSchema);