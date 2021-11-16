'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const key = require('./key');

exports.createToken = (user) =>{
    const payload = {
        sub: user._id,
        dpi: user.dpi,
        username: user.username,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        age: user.age,
        direccion: user.direccion,
        urlImagen: user.urlImagen,
        sex: user.sex,
        bith: user.birth,
        iat: moment().unix(),
        exp: moment().add(1, "day").unix()
    }
    return jwt.encode(payload, key);
}