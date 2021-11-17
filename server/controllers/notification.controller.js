'use strict'

const Notification = require("../models/notification.model");

function saveNotification(notificationData){
    let notification = new Notification();
    if(notificationData.title && notificationData.text && notificationData.image && notificationData.date && notificationData.viewed && notificationData.url){
        notification.title = notificationData.title;
        notification.text = notificationData.text;
        notification.image = notificationData.image;
        notification.date = notificationData.date;
        notification.viewed = notificationData.viewed;
        notification.url = notificationData.url;

        notification.save((err,saved)=>{
            if(err){
                console.log(err);
                return null;
            }else if(saved)
                return saved._id;
            else
                return null;
        })
    }else{
        return null;
    }
}

function setAsViewed(req,res){
    
}

module.exports = {
    saveNotification
}