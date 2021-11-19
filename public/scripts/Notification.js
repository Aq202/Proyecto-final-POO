import { Session } from "./Session.js";

export class Notification {

    static async getNotifications({skip, quantity}) {

        return new Promise((resolve, reject) => {

            let obj = {
                skip,
                quantity
            }

            let reqObject;
            fetch("/notification/getNotifications", {
                method: "POST",
                body:JSON.stringify(obj),
                headers: {
                    'Authorization': Session.token,
                    "Content-Type": "application/json"
                }
            })
                .then(r => {
                    reqObject = r;
                    return r.json();
                })
                .then(result => {
                    console.log(result)
                    if (reqObject.ok === true) {

                        resolve(result.notifications)
                    } else {
                        reject();
                    }

                }).catch(e => reject());



        })



    }


    static async setAsViewed(notificationId) {

        return new Promise((resolve, reject) => {

            let obj = {
                notificationId
            }

            let reqObject;
            fetch("/notification/setAsViewed", {
                method: "POST",
                body:JSON.stringify(obj),
                headers: {
                    'Authorization': Session.token,
                    "Content-Type": "application/json"
                }
            })
                .then(r => {
                    reqObject = r;
                    return r.json();
                })
                .then(result => {
                    console.log(result)
                    if (reqObject.ok === true) {
                        resolve()
                    } else {
                        reject();
                    }

                }).catch(e => reject());

        });

    }


    static async delete(notificationId) {

        return new Promise((resolve, reject) => {

            let obj = {
                notificationId
            }

            let reqObject;
            fetch("/notification/deleteNotification", {
                method: "DELETE",
                body:JSON.stringify(obj),
                headers: {
                    'Authorization': Session.token,
                    "Content-Type": "application/json"
                }
            })
                .then(r => {
                    reqObject = r;
                    return r.json();
                })
                .then(result => {
                    console.log(result)
                    if (reqObject.ok === true) {
                        resolve()
                    } else {
                        reject();
                    }

                }).catch(e => reject());

        });



    }

    static async setAllAsViewed(notificationId) {

        return new Promise((resolve, reject) => {

            let reqObject;
            fetch("/notification/setAllAsViewed", {
                method: "POST",
                headers: {
                    'Authorization': Session.token,
                    "Content-Type": "application/json"
                }
            })
                .then(r => {
                    reqObject = r;
                    return r.json();
                })
                .then(result => {
                    console.log(result)
                    if (reqObject.ok === true) {
                        resolve()
                    } else {
                        reject();
                    }

                }).catch(e => reject());

        });



    }

    static async deleteAll(notificationId) {

        return new Promise((resolve, reject) => {

            let reqObject;
            fetch("/notification/deleteAllNotifications", {
                method: "DELETE",
                headers: {
                    'Authorization': Session.token,
                    "Content-Type": "application/json"
                }
            })
                .then(r => {
                    reqObject = r;
                    return r.json();
                })
                .then(result => {
                    console.log(result)
                    if (reqObject.ok === true) {
                        resolve()
                    } else {
                        reject();
                    }

                }).catch(e => reject());

        });



    }


}