'use strict'

const express = require('express');
const http = require("http");
const socketServer = require("./socket");
const jwt = require("jsonwebtoken");
const key = require("./server/key")

const app = express();
const httpServer = http.createServer(app);

app.use(express.json())
app.use(express.static('./public'))
app.use(express.urlencoded({extended:true}))

socketServer(httpServer)

app.get("/", (req, res) =>{

    res.sendFile(__dirname+ "/public/html/chat.html")
})

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

app.get("/login", (req, res) =>{
    res.sendFile(__dirname+ "/public/html/login.html")
    
})




httpServer.listen(3000, ()=>{
    console.log("Servidor corriendo en puerto 3000.");
})