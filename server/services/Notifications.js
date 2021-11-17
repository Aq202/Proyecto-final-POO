const socket = require("./server/services/socketServer");
const notificationController = require("../controllers/notification.controller");


module.exports = class Notifications{

    async static sendWelcomeNotification({userName}){

        const notificationData = {
            title: `¡Bienvenido ${userName}!`,
            text: `Estamos muy felices  de tenerte con nosotros`,
            image: null,
            date: new Date(),
            viewed:false
        };

        // Guardar la información en la BD
        // obtener el ID generado
        
        const id = ""; //await notificationController.saveNotification(notificationData);
        
        notificationData["id"] = id;

        socket.io.emit("global-notification", notificationData);

    }

    async static sendNewRquestNotification({applicantName, productName, productId, applicantProfileImage, ownerId }){

        const notificationData = {
            title: `Nueva solicitud de donación`,
            text: `${applicantName} te ha enviado una solicitud de donación para tu tu producto "${productName}".`,
            image: applicantProfileImage,
            date: new Date(),
            viewed:false,
            url: `/product?productId=${productId}`
        };

        // Guardar la información en la BD
        // obtener el ID generado
        
        const id = "";// await saveNotification(notificationData);
        
        notificationData["id"] = id;

        socket.io.emit(`${ownerId}-notification`, notificationData);
        
    }




}