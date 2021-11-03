'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = Schema({
    owner: String,
    ownerId: String,
    name: String,
    description: String,
    available: Boolean,
    publishDate: Date,
    cathegory: String,
    department: String,
    municipality: String,
    images:[],
    interested: [{ type: Schema.Types.ObjectId, ref: 'user' }]
});

module.exports = mongoose.model('product', productSchema);