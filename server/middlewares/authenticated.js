'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const key = require('../services/key');

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Petición sin autenticación.' });
    } else {
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try {
            var payload = jwt.decode(token, key);
            if (payload.exp <= moment().unix()) {
                return res.status(401).send({ message: 'Token expirado' });
            }
        } catch (ex) {
            return res.status(401).send({ message: 'Token no válido.' });
        }
        req.user = payload;
        next();
    }
}

exports.choicelyAuth = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization == "" || req.headers.authorization == undefined || req.headers.authorization == null) {
        req.user = null;
        next();
    } else {
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try {
            var payload = jwt.decode(token, key);
            if (payload.exp <= moment().unix()) {
                req.user = null;
            }
        } catch (ex) {
            req.user = null;
        }
        req.user = payload;
        next();
    }
}