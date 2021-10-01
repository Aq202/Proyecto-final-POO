
const jwt = require("jsonwebtoken")
const key = require("./services/key")


module.exports = class SocketServer {

    constructor(server) {
        this.io = require("socket.io")(server);

        this.executeMiddleWares()
        this.initServer()
    }

    

    executeMiddleWares() {

        //validar token
        this.io.use((socket, next) => {

            const token = socket.handshake.auth.token;
            jwt.verify(token, key, (err, userInfo) => {
                if (err) {
                    const err = new Error("not authorized");
                    next(err);
                } else {
                    socket.userInfo = userInfo
                    next();
                }
            })
        })

    }

    initServer() {

        this.io.on("connection", socket => {
            console.log("Cliente conectado")
            
            


        })

        

    }


}