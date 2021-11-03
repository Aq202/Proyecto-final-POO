'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const key = require('../services/key');

exports.ensureAuth = (req, res, next) => {
//console.log(req)
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Petición sin autenticación.' });
    } else {
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try {
            var payload = jwt.decode(token, key);
        } catch (ex) {
            return res.status(401).send({ message: 'Token no válido.' });
        }
        req.user = payload;
        next();
    }
}