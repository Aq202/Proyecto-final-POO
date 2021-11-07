
const jwt = require("jsonwebtoken")
const key = require("./key")


module.exports = class SocketServer {

    static io;

    constructor(server) {
        SocketServer.io = require("socket.io")(server);

        this.executeMiddleWares()
        this.initServer()
    }

    

    executeMiddleWares() {

        //validar token
        SocketServer.io.use((socket, next) => {

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

        SocketServer.io.on("connection", socket => {
            console.log("Cliente conectado")
            
            


        })

        

    }


}