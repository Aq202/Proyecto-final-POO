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
            url: `#/product?productId=${productId}`
        };

   
        try{
        const id = await notificationController.saveNotification(notificationData);

        notificationData["id"] = id;
            console.log("Ruta socket::",`${ownerId}-notification`)
        socket.io.emit(`${ownerId}-notification`, notificationData);

        }catch(ex){
            console.log("Error al enviar notificacion de nueva solicitud. ", ex);
        }

    }

    static async sendRequestRejectedNotification({  productName, productId, productImages, applicantId }) {

        const notificationData = {
            userId: applicantId,
            title: `Solicitud de donación rechazada`,
            text: `Tu solicitud para el producto ${productName} ha sido rechazada.`,
            image: (Array.isArray(productImages) && productImages.length > 0) ? productImages[0] : null,
            date: new Date(),
            viewed: false,
            url: `#/product?productId=${productId}`
        };

   
        try{
        const id = await notificationController.saveNotification(notificationData);

        notificationData["id"] = id;

        socket.io.emit(`${applicantId}-notification`, notificationData);

        }catch(ex){
            console.log("Error al enviar notificacion de solicitud rechazada . ", ex);
        }
    }


    static async sendRequestApprovedNotification({  productName, productId, productImages, applicantId }) {

        const notificationData = {
            userId: applicantId,
            title: `Solicitud de donación aprobada.`,
            text: `Tu solicitud para el producto ${productName} ha sido aprobada.`,
            image: (Array.isArray(productImages) && productImages.length > 0) ? productImages[0] : null,
            date: new Date(),
            viewed: false,
            url: `#/product?productId=${productId}`
        };

   
        try{
        const id = await notificationController.saveNotification(notificationData);

        notificationData["id"] = id;

        socket.io.emit(`${applicantId}-notification`, notificationData);

        }catch(ex){
            console.log("Error al enviar notificacion de solicitud rechazada . ", ex);
        }
    }

    static async sendDonationConfirmedAsReceivedNotification({  productName, productId, productImages, ownerId, applicantName }) {

        const notificationData = {
            userId: ownerId,
            title: `Donación confirmada de recibida.`,
            text: `${applicantName} ha confirmado de recibida la donación de ${productName}`,
            image: (Array.isArray(productImages) && productImages.length > 0) ? productImages[0] : null,
            date: new Date(),
            viewed: false,
            url: `#/product?productId=${productId}`
        };

   
        try{
        const id = await notificationController.saveNotification(notificationData);

        notificationData["id"] = id;

        socket.io.emit(`${ownerId}-notification`, notificationData);

        }catch(ex){
            console.log("Error al enviar notificacion de solicitud rechazada . ", ex);
        }
    }

    static async sendDonationRejectedByBeneficiaryNotification({  productName, productId, productImages, ownerId, applicantName }) {

        const notificationData = {
            userId: ownerId,
            title: `Donación rechazada`,
            text: `${applicantName} ha rechazado la donación de ${productName}`,
            image: (Array.isArray(productImages) && productImages.length > 0) ? productImages[0] : null,
            date: new Date(),
            viewed: false,
            url: `#/product?productId=${productId}`
        };

   
        try{
        const id = await notificationController.saveNotification(notificationData);

        notificationData["id"] = id;

        socket.io.emit(`${ownerId}-notification`, notificationData);

        }catch(ex){
            console.log("Error al enviar notificacion de solicitud rechazada . ", ex);
        }
    }

}