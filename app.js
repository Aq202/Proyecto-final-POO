'use strict'

const express = require('express');
const http = require("http");
const socketServer = require("./server/socketServer");
const jwt = require("jsonwebtoken");
const key = require("./server/key")

const app = express();
const httpServer = http.createServer(app);

app.use(express.json())
app.use(express.static('./public'))
app.use(express.urlencoded({extended:true}))

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

    for(let i = 1; i <= 10; i++){
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




httpServer.listen(2002, ()=>{
    console.log("Servidor corriendo en puerto 3000.");
})