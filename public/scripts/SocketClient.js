
import { Session } from "./Session.js";


export class SocketClient {

    static async initSocket() {

        return new Promise((resolve, reject) => {
            if (Session.userInSession === true && Session.token !== undefined) {

                try{
                    SocketClient.createSocketInstance();
                    SocketClient.startListening();

                }catch(ex){
                    reject(ex);
                }

            } else {
                reject("Usuario no autenticado.");
            }


        })

    }

    static createSocketInstance() {

        SocketClient.socketIo = io({
            auth: {
                token: Session.token
            }
        });
    }

    static startListening() {
        
        if(SocketClient.socketIo === undefined) return;

        SocketClient.socketIo.on("connect_error", err => {

            if(err.message === "not authorized"){
                console.warn("Desconectando socket")
                SocketClient.socketIo.removeAllListeners();
            }
        })

        SocketClient.socketIo.on("global-notification", msg => {

            const notificationEvent = new CustomEvent("newNotification", { detail: msg });
            document.dispatchEvent(notificationEvent);
            console.warn("Nueva notificación global")
        })

        console.log("socket direction:::",`${Session.id}-notification`)
        //notification personal
        SocketClient.socketIo.on(`${Session.id}-notification`, msg => {

            const notificationEvent = new CustomEvent("newNotification", { detail: msg });
            document.dispatchEvent(notificationEvent);
            console.warn("Nueva notificación privada")
        })
    }

}