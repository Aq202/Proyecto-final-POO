'use strict'

const mongoose = require('mongoose');
const port = 2004;
const express = require('express');
const http = require("http");
const socketServer = require("./server/socketServer");
const jwt = require("jsonwebtoken");
const key = require("./server/services/key");

const userRoutes = require('./server/routes/user.route');
const productRoutes = require('./server/routes/product.route');




const app = express();
const httpServer = http.createServer(app);

mongoose.Promise = global.Promise;
// Conexión a base de datos en la nube
mongoose.connect('mongodb+srv://epdPOO:proyectofinal@cluster0.kxclx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(()=>{
        console.log('Conexión correcta a la base de datos.');
        httpServer.listen(port, (serv)=>{
            console.log("Servidor corriendo en puerto "+port);
        })
    }).catch(err=>{
        console.log('Error de conexión.', err);
    });

app.use(express.json())
app.use(express.static('./public'))
app.use(express.urlencoded({extended:true}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/user', userRoutes);
app.use('/product', productRoutes);


const socket = new socketServer(httpServer)


app.post("/login", (req, res) => {
 
    const userId = req.body.user;
    const password = req.body.password;

    if(userId != undefined && password != undefined){

        jwt.sign({
            user:userId
        }, key, (err, token) =>{
            if(err) res.sendStatus(403);
            
            res.json({
                token
            })
        })


    }else{
        res.sendStatus(404)
    }
})

app.post("/emit", (req, res) =>{
    //id, title, text, image, url, date, viewed
    console.log(req.body)
    console.log("enviando jjsjss")
     socket.io.emit("global-notification",{
         title:req.body.title,
         text:req.body.text,
         url:req.body.url,
         id:req.body.id,
         date:new Date()

     })

    res.send("enviado")
})

app.get("/", (req, res) =>{
    res.sendFile(__dirname+ "/public/index.html")
    
})

app.post("/fakeNotifications", (req, res)=>{
    //id, title, text, image, url, date, viewed
    const notif = []

    for(let i = 1; i <= req.body.max; i++){
        notif.push({
            id: "sadflkasñfkasfk",
            title: "Titulo "+i,
            text: "Texto de notificacion "+i,
            image: `images/profileImages/${i}.jpg`,
            date: new Date(),
            viewed: false
        })
    }

    setTimeout(()=>{
        res.json({
            notifications:notif
        })
    },3000)
})




