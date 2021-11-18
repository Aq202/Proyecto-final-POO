'use strict'

const User = require('../models/user.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const WelcomeEmail = require('../services/WelcomeEmail');
const mongoose = require('mongoose');
const Notifications = require('../services/Notifications');

function getUserProducts(req, res) {
    const params = req.body;
    let userId = null;
    try {
        userId = mongoose.Types.ObjectId(params.userId);
    } catch (ex) {
        userId = null;
        console.log(ex);
    }
    if (userId != null) {
        User.findById(userId, (err, found) => {
            if (err) {
                res.status(500).send({ error: "Error interno del servidor" });
            } else if (found) {
                res.send({
                    profilePic: found.profilePic,
                    name: found.name + " " + found.lastname,
                    username: found.username,
                    donations: found.donations,
                    adquisitions: found.adquisitions
                });
            } else
                res.status(404).send({ message: "No se han encontrado usuarios con el ID especificado" });
        })
    } else {
        res.status(400).send({ message: "Debe indicar un ID de usuario válido." });
    }
}

function signIn(req, res) {
    const params = req.body;
    const user = new User();
    let today = Date.now();

    if (params.dpi && params.username && params.email && params.password && params.name && params.lastname && params.address && params.sex && params.birth) {
        User.findOne({ $or: [{ username: params.username }, { email: params.email }, { dpi: params.dpi }] }, (err, found) => {
            if (err)
                res.status(500).send({ error: 'Error interno del servidor.', err });
            else if (found)
                res.status(403).send({ message: 'El dpi, nombre de usuario o correo electrónico ingresado ya está en uso.' });
            else {
                let birth = new Date(params.birth);
                user.dpi = params.dpi;
                user.username = params.username;
                user.email = params.email;
                user.name = params.name;
                user.lastname = params.lastname;
                user.age = calculateAge(birth, today);
                user.direccion = params.direccion;
                user.sex = params.sex;
                user.birth = birth;

                try {
                    let profilePic = "";
                    let documents = [];
                    let contador = 0;
                    req.imagesUrl.forEach(image => {
                        let imageArray = image.split('/');
                        image = "";
                        for (let i = 2; i < imageArray.length; i++) {
                            image += imageArray[i]
                            if (i !== (imageArray.length - 1)) image += "/";
                        }
                        if (contador == 0)
                            profilePic = image;
                        else
                            documents.push(image);
                        contador++;
                    });
                    user.profilePic = profilePic;
                    user.documents = documents;
                } catch (ex) {
                    console.log("Error al guardar las imagenes", ex);
                }

                bcrypt.hash(params.password, null, null, (err, passwordEncripted) => {
                    if (err)
                        res.status(500).send({ error: 'Error interno del servidor.', err });
                    else if (passwordEncripted) {
                        user.password = passwordEncripted;
                        user.save((err, saved) => {
                            if (err)
                                res.status(500).send({ error: 'Error interno del servidor.', err });
                            else if (saved) {
                                try {

                                    //enviar correo de Bienvenida
                                    const email = new WelcomeEmail({
                                        userName: params.name,
                                        userEmail: params.email
                                    });
                                    email.sendEmail();

                                    //enviar notificacion de bienvenida
                                    Notifications.sendWelcomeNotification({
                                        userId: saved._id,
                                        userName: params.name
                                    })

                                } catch (ex) {

                                }

                                login(req, res);
                            } else
                                res.status(400).send({ error: 'Error de registro.' });
                        });
                    } else
                        res.status(400).send({ error: 'Error de encriptación.' });
                });
            }
        });
    } else
        res.status(400).send({ mensaje: 'Debe ingresar todos los parámetros requeridos.' });
}

function login(req, res) {

    const params = req.body;

    if (params.username || params.email) {
        if (params.password) {
            User.findOne({ $or: [{ username: params.username }, { email: params.email }] }, (err, found) => {
                if (err)
                    res.status(500).send({ error: 'Error interno del servidor.' });
                else if (found) {
                    bcrypt.compare(params.password, found.password, (err, matched) => {
                        if (err)
                            res.status(500).send({ error: 'Error interno del servidor.' });
                        else if (matched) {
                            if (params.gettoken = true) {
                                res.send({
                                    'Id': found._id,
                                    'DPI': found.dpi,
                                    'Username': found.username,
                                    'Email': found.email,
                                    'Name': found.name,
                                    'Lastname': found.lastname,
                                    'Age': found.age,
                                    'Direction': found.address,
                                    'profilePic': found.profilePic,
                                    'Sex': found.sex,
                                    'Birth': found.birth,
                                    'Token': jwt.createToken(found)
                                });
                            } else
                                res.status(500).send({ error: 'Error al autenticar.' });
                        } else
                            res.status(403).send({ message: 'Contraseña incorrecta.' });
                    });
                } else
                    res.status(500).send({ message: 'Nombre de usuario o correo electrónico incorrectos.' });
            });
        } else
            res.status(400).send({ message: 'Ingrese su contraseña.' });
    } else
        res.status(400).send({ message: 'Ingrese su correo electrónico o nombre de usuario.' });
}

function calculateAge(birth, today) {
    let diffMonths = today - birth.getTime();
    let ageDate = new Date(diffMonths);
    let age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age;
}

function getInfoUser(req, res) {
    if (req.user.sub) {
        let userId = req.user.sub;
        User.findById(userId, (err, found) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error: "Error interno del servidor." });
            } else if (found) {
                res.send({
                    'Id': found._id,
                    'DPI': found.dpi,
                    'Username': found.username,
                    'Email': found.email,
                    'Name': found.name,
                    'Lastname': found.lastname,
                    'Age': found.age,
                    'Direction': found.address,
                    'profilePic': found.profilePic,
                    'Sex': found.sex,
                    'Birth': found.birth
                });
            } else {
                res.status(404).send({ message: "No se han encontrado usuarios con el ID indicado." });
            }
        })
    } else {
        res.status(400).send({ message: "Debe iniciar sesión para acceder a esta función." });
    }
}

module.exports = {
    signIn,
    login,
    getInfoUser,
    getUserProducts
}