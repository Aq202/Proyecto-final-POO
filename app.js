'use strict'

const mongoose = require('mongoose');
const port = 2004;
const express = require('express');
const http = require("http");
const socketServer = require("./server/services/socketServer");
const jwt = require("jsonwebtoken");
const key = require("./server/services/key");

const userRoutes = require('./server/routes/user.route');
const productRoutes = require('./server/routes/product.route');
const requestRoutes = require('./server/routes/request.route');
const notificationController = require('./server/routes/notification.route');
const RequestApprovedEmail = require('./server/services/RequestApprovedEmail');
const RequestRejectedEmail = require('./server/services/RequestRejectedEmail');
const NewRequestEmail = require('./server/services/NewRequestEmail');
const DonationConfirmedAsReceived = require('./server/services/DonationConfirmedAsReceivedEmail');
const Notifications = require('./server/services/Notifications');


const app = express();
const httpServer = http.createServer(app);

try{
mongoose.Promise = global.Promise;
// Conexión a base de datos en la nube
mongoose.connect('mongodb+srv://epdPOO:proyectofinal@cluster0.kxclx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => {
        console.log('Conexión correcta a la base de datos.');

    }).catch(err => {
        console.log('Error de conexión.', err);
    });
}catch(ex){
    console.log(ex)
}

httpServer.listen(port, (serv) => {
    console.log("Servidor corriendo en puerto " + port);
});
app.use(express.json())
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }))

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method', 'multipart/form-data');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//     next();
// });

app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/request', requestRoutes);
app.use('/notification', notificationController);

new socketServer(httpServer)

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")


})

app.get("/hola", (req, res) => {
    
    console.log(Notifications)

    Notifications.sendWelcomeNotification({
        userName:"El jajas",
    });
    res.send("Notificacion enviada");


})


app.post("/fakeNotifications", (req, res) => {
    //id, title, text, image, url, date, viewed
    const notif = []

    for (let i = 1; i <= req.body.max; i++) {
        notif.push({
            id: "sadflkasñfkasfk",
            title: "Titulo " + i,
            text: "Texto de notificacion " + i,
            image: `images/profileImages/${i}.jpg`,
            date: new Date(),
            viewed: false
        })
    }

    setTimeout(() => {
        res.json({
            notifications: notif
        })
    }, 3000)
})
