'use strict'

const User = require('../models/user.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Product = require('../models/product.model');

function signIn(req,res){
    const params = req.body;
    const user = new User();

    if(params.dpi && params.username && params.age && params.email && params.password && params.name && params.lastname && params.direction && params.sex && params.birth){
        User.findOne({$or: [{ username: params.username }, { email: params.email }] }, (err, found) => {
            if(err)
                res.status(500).send({error: 'Error interno del servidor.', err});
            else if(found)
                res.status(400).send({ message: 'El nombre de usuario o correo electrónico ingresado ya está en uso.' });
            else{
                user.dpi = params.dpi;
                user.username = params.username;
                user.email = params.email;
                user.name = params.name;
                user.lastname = params.lastname;
                user.age = params.age;
                user.direccion = params.direccion;
                user.sex = params.sex;
                user.birth = params.birth;

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
                                'User signed': '',
                                'ID': saved._id,
                                'DPI': saved.dpi,
                                'Username': saved.username,
                                'Email': saved.email,
                                'Password': saved.password,
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
    const user = new User();

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
                                    'Logged User': '',
                                    'ID': found._id,
                                    'DPI': found.dpi,
                                    'Username': found.username,
                                    'Email': found.email,
                                    'Password': found.password,
                                    'Name': found.name,
                                    'Lastname': found.lastname,
                                    'Age': found.age,
                                    'Direction': found.direccion,
                                    'URLImage': found.URLImagen,
                                    'Sex': found.sexo,
                                    'Birth': found.birth,
                                    'Token': jwt.createToken(found)
                                });
                            }else
                                res.status(500).send({ error: 'Error al autenticar.' });
                        }else
                            res.status(400).send({ message: 'Contraseña incorrecta.' });
                    });
                }else
                    res.status(404).send({ message: 'Nombre de usuario o correo electrónico incorrectos.' });
            });
        }else
            res.status(400).send({ message: 'Ingrese su contraseña.' });
    }else
        res.status(400).send({ message: 'Ingrese su correo electrónico o nombre de usuario.' });
}

module.exports={
    signIn,
    login
}