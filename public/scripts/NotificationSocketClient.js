 
export class NotificationSocketClient {

    constructor(userId) {
        this.userId = userId;

        this.initSocket()
        this.startListening()
        
    }

    initSocket() {
        const token = localStorage.getItem("sessionToken")
        if (!token) return;

        this.socketIo = io({
            auth:{
                token
            }
        });

    }

    startListening(){

        

        this.socketIo.on("connect_error", err =>{
            console.error(err.message)
        })

        this.socketIo.on("global-notification", msg =>{
            
            const notificationEvent = new CustomEvent("newNotification", { detail:msg });
            document.dispatchEvent(notificationEvent);
            console.warn("evento enviado")
        })
    }

  


}