'use strict'

const User = require('../models/user.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function signIn(req,res){
    const params = req.body;
    const user = new User();
    let today = Date.now();

    if(params.dpi && params.username && params.email && params.password && params.name && params.lastname && params.address && params.sex && params.birth){
        User.findOne({$or: [{ username: params.username }, { email: params.email }, {dpi:params.dpi}] }, (err, found) => {
            if(err)
                res.status(500).send({error: 'Error interno del servidor.', err});
            else if(found)
                res.status(403).send({ message: 'El dpi, nombre de usuario o correo electrónico ingresado ya está en uso.' });
            else{
                let birth = new Date(params.birth);
                user.dpi = params.dpi;
                user.username = params.username;
                user.email = params.email;
                user.name = params.name;
                user.lastname = params.lastname;
                user.age = calculateAge(brth, today);
                user.direccion = paramsi.direccion;
                user.sex = params.sex;
                user.birth = birth;

                bcrypt.hash(params.password, null, null, (err, passwordEncripted)=>{
                    if(err)
                        res.status(500).send({ error: 'Error interno del servidor.', err });
                    else if(passwordEncripted){
                        user.password = passwordEncripted;
                        user.save((err, saved)=>{
                            if(err)
                                res.status(500).send({ error: 'Error interno del servidor.', err });
                            else if(saved){
                            res.send({
                                'User signed': saved._id,
                                'DPI': saved.dpi,
                                'Username': saved.username,
                                'Email': saved.email,
                                'Name': saved.name,
                                'Lastname': saved.lastname,
                                'Age': saved.age,
                                'Direction': saved.direccion,
                                'URLImagen': saved.URLImagen,
                                'Sex': saved.sex,
                                'Birth': saved.birth
                            });
                            }else
                                res.status(400).send({ error: 'Error de registro.' });
                        });
                    }else
                    res.status(400).send({ error: 'Error de encriptación.' });
                });
            }
        });
    }else
    res.status(400).send({ mensaje: 'Debe ingresar todos los parámetros requeridos.' });
}

function login(req,res){
    const params = req.body;

    if(params.username || params.email){
        if(params.password){
            User.findOne({ $or: [{ username: params.username }, { email: params.email }] }, (err, found) =>{
                if(err)
                    res.status(500).send({ error: 'Error interno del servidor.' });
                else if(found){
                    bcrypt.compare(params.password, found.password, (err, matched)=>{
                        if(err)
                            res.status(500).send({ error: 'Error interno del servidor.' });
                        else if(matched){
                            if(params.gettoken = true){
                                res.send({
                                    'Logged User': found._id,
                                    'DPI': found.dpi,
                                    'Username': found.username,
                                    'Email': found.email,
                                    'Name': found.name,
                                    'Lastname': found.lastname,
                                    'Age': found.age,
                                    'Direction': found.address,
                                    'URLImage': found.urlImage,
                                    'Sex': found.sex,
                                    'Birth': found.birth,
                                    'Token': jwt.createToken(found)
                                });
                            }else
                                res.status(500).send({ error: 'Error al autenticar.' });
                        }else
                            res.status(403).send({ message: 'Contraseña incorrecta.' });
                    });
                }else
                    res.status(404).send({ message: 'Nombre de usuario o correo electrónico incorrectos.' });
            });
        }else
            res.status(400).send({ message: 'Ingrese su contraseña.' });
    }else
        res.status(400).send({ message: 'Ingrese su correo electrónico o nombre de usuario.' });
}

function calculateAge(birth,today){
    let diffMonths = today-birth.getTime();
    let ageDate = new Date(diffMonths);
    let age = Math.abs(ageDate.getUTCFullYear()-1970);
    return age;
}

module.exports={
    signIn,
    login
}