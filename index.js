'use strict'

var mongoose = require('mongoose');
var port = 16800;
var app = require('./server/app');

mongoose.Promise = global.Promise;

//Conexión local a base de datos
/*mongoose.connect('mongodb://localhost:27017/DBDonationApp', { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(()=>{
        console.log('Conexión correcta a la base de datos.');
        app.listen(port, ()=>{
            console.log('Servidor de express corriendo en el puerto: ', port)
        });
    }).catch(err=>{
        console.log('Error de conexión.', err);
    });*/

// Conexión a base de datos en la nube
mongoose.connect('mongodb+srv://epdPOO:proyectofinal@cluster0.kxclx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(()=>{
        console.log('Conexión correcta a la base de datos.');
        app.listen(port, ()=>{
            console.log('Servidor de express corriendo en el puerto: ', port)
        });
    }).catch(err=>{
        console.log('Error de conexión.', err);
    });