import { Session } from "./Session.js";

export class DonationRequest {

    constructor({ requestId, userId, userName, userAlias, profileImage, userEmail, userDPI, userGender, userAge, requestMessage, documents, date, selected }) {

        this.requestId = requestId || null;
        this.userName = userName;
        this.userAlias = userAlias;
        this.profileImage = profileImage;
        this.userEmail = userEmail;
        this.userDPI = userDPI;
        this.userGender = userGender;
        this.userAge = userAge;
        this.requestMessage = requestMessage;
        this.documents = documents || [];
        this.date = date || new Date();
        this.selected = selected || false;
        this.loaded = false; //si ya se cargo la info

    }

    static newRequestOfDonation({ productId, requestMessage }) {

        return new Promise((resolve, reject) => {

            const obj = {
                message: requestMessage,
                productId
            }

            let reqObj;

            fetch("/request/newRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Session.token
                },
                body: JSON.stringify(obj)
            })
                .then(r => {
                    reqObj = r;
                    return r.json();
                })
                .then(result => {
                    console.log(result)
                    if (reqObj.ok === true) {
                        resolve(result)
                    } else {
                        reject(result)
                    }
                })
                .catch(err => reject(err));


        })
    }

    acceptRequest() {

        return new Promise((resolve, reject) => {

            if (this.requestId === null) reject("Id de solicitud rechazado.")

            const obj = {
                requestId: this.requestId
            }

            let reqObj;

            fetch("/request/approveRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Session.token
                },
                body: JSON.stringify(obj)
            })
                .then(r => {
                    reqObj = r;
                    return r.json();
                })
                .then(result => {

                    console.log(result)
                    if (reqObj.ok === true) {
                        resolve(result)
                    } else {
                        reject(result)
                    }
                })
                .catch(err => reject(err));


        });

    }

    rejectRequest() {

        return new Promise((resolve, reject) => {

            if (this.requestId === null) reject("Id de solicitud rechazado.")

            const obj = {
                requestId: this.requestId
            }

            let reqObj;

            fetch("/request/rejectRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Session.token
                },
                body: JSON.stringify(obj)
            })
                .then(r => {
                    reqObj = r;
                    return r.json();
                })
                .then(result => {

                    console.log(result)
                    if (reqObj.ok === true) {
                        resolve(result)
                    } else {
                        reject(result)
                    }
                })
                .catch(err => reject(err));


        });

    }

    /**
     * Elimina la solicitud propia de un usuario
     * @returns Promise
     */
    deleteRequest(productId) {

        return new Promise((resolve, reject) => {

            const obj = {
                productId
            }
            console.log(obj)
            let reqObj;

            fetch("/request/cancelRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Session.token
                },
                body: JSON.stringify(obj)
            })
                .then(r => {
                    reqObj = r;
                    return r.json();
                })
                .then(result => {
                    console.log(result)
                    if (reqObj.ok === true) {
                        resolve(result)
                    } else {
                        reject(result.error)
                    }
                })
                .catch(err => reject(err));


        });

    }

    confirmOfReceived() {

        return new Promise((resolve, reject) => {

            if (this.requestId === null) reject("Id de solicitud rechazado.")

            const obj = {
                requestId: this.requestId
            }

            let reqObj;

            fetch("/request/approveRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Session.token
                },
                body: JSON.stringify(obj)
            })
                .then(r => {
                    reqObj = r;
                    return r.json();
                })
                .then(result => {

                    console.log(result)
                    if (reqObj.ok === true) {
                        resolve(result)
                    } else {
                        reject(result)
                    }
                })
                .catch(err => reject(err));


        });

    }


    getRequestFullData() {

        return new Promise((resolve, reject) => {

            if (this.requestId === null) reject("Id de solicitud rechazado.")

            const obj = {
                requestId: this.requestId
            }

            let reqObj;

            fetch("/request/getRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Session.token
                },
                body: JSON.stringify(obj)
            })
                .then(r => {
                    reqObj = r;
                    return r.json();
                })
                .then(result => {

                    console.log(result)
                    if (reqObj.ok === true) {

                        this.userName = result.name;
                        this.userAlias = result.username;
                        this.profileImage = result.profilePicture;
                        this.userEmail = result.email;
                        this.userDPI = result.dpi;
                        this.userGender = result.sex;
                        this.userAge = result.age;
                        this.requestMessage = result.message;
                        this.documents = result.documents;
                        this.date = result.requestedDate;
                        this.selected = result.approved;
                        this.loaded = true;

                        resolve();
                    
                    } else {
                        reject(result)
                    }
                })
                .catch(err => reject(err));


        });

    }

    static getRequests(productId) {

        return new Promise((resolve, reject) => {

            const obj = {
                productId
            }

            let reqObj;

            fetch("/product/currentRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Session.token
                },
                body: JSON.stringify(obj)
            })
                .then(r => {
                    reqObj = r;
                    return r.json();
                })
                .then(result => {
                    
                    if (reqObj.ok === true) {

                        resolve(result.currentRequests.map(req => {
                            
                            return {
                                requestId: req.request,
                                userName: req.petitioner,
                                date: req.requestedDate,
                                profileImage: req.profilePicture,
                                selected: req.approved
                            }
                        }))
                    } else {
                        reject(result)
                    }
                })
                .catch(err => reject(err));


        });

    }
}