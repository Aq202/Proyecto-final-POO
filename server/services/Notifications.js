const socket = require("./socketServer");
const notificationController = require("../controllers/notification.controller");


module.exports = class Notifications {

    static async sendWelcomeNotification({ userId, userName }) {

        const notificationData = {
            userId: userId,
            title: `¡Bienvenido ${userName}!`,
            text: `Estamos muy felices  de tenerte con nosotros`,
            image: null,
            date: new Date(),
            viewed: false,
            url: `#/profile?id=${userId}`
        };

        // Guardar la información en la BD
        try {
            const id = await notificationController.saveNotification(notificationData);

            notificationData["id"] = id;

            socket.io.emit(`${userId}-notification`, notificationData);
        } catch (ex) {

        }

    }

    static async sendNewRequestNotification({ applicantName, productName, productId, applicantProfileImage, ownerId }) {

        const notificationData = {
            userId: ownerId,
            title: `Nueva solicitud de donación`,
            text: `${applicantName} te ha enviado una solicitud de donación para tu tu producto "${productName}".`,
            image: applicantProfileImage,
            date: new Date(),
            viewed: false,
            url: `/product?productId=${productId}`
        };

   
        try{
        const id = await notificationController.saveNotification(notificationData);

        notificationData["id"] = id;

        socket.io.emit(`${ownerId}-notification`, notificationData);

        }catch(ex){
            console.log("Error al enviar notificacion de nueva solicitud.");
        }

    }




}