'use strict'

const Notification = require("../models/notification.model");

async function saveNotification({userId, title, text, image, date, viewed, url}) {
    console.log(notificationData);

    return new Promise((resolve, reject) => {
        
        let notification = new Notification();
        if (userId) {
           
            notification.userId = userId
            notification.title = title || "Nueva notificación.";
            notification.text = text || "Nueva notificación.";
            notification.image = image || null;
            notification.date = date || new Date();
            notification.viewed = viewed ?? false;
            notification.url = url || null;

            notification.save((err, saved) => {
                if (err) {
                    reject(err);
                } else if (saved)
                    resolve(saved._id);
                else{
    
                reject("Notificación no guardada");
            }
            })
        } else {

            reject("No se cuenta con el id de usuario");
        }
    })
}

function setAsViewed(req, res) {
    let params = req.body;
    let notificationId = null;
    let userId = null;


}

module.exports = {
    saveNotification
}