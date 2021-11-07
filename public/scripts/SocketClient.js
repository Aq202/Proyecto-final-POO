
import { Session } from "./Session.js";


export class SocketClient {

    constructor() {

    }

    async initSocket() {

        return new Promise((resolve, reject) => {
            if (Session.userInSession === true && Session.token !== undefined) {

                try{
                    this.createSocketInstance();
                    this.startListening();

                }catch(ex){
                    reject(ex);
                }

            } else {
                reject("Usuario no autenticado.");
            }


        })

    }

    async createSocketInstance() {

        this.socketIo = io({
            auth: {
                token: Session.token
            }
        });
    }

    startListening() {

        if(this.socketIo === undefined) return;

        this.socketIo.on("connect_error", err => {

            if(err.message === "not authorized"){
                console.warn("Desconectando socket")
                this.socketIo.removeAllListeners();
            }
        })

        this.socketIo.on("global-notification", msg => {

            const notificationEvent = new CustomEvent("newNotification", { detail: msg });
            document.dispatchEvent(notificationEvent);
            console.warn("evento enviado")
        })
    }




}