import { Session } from "./Session.js";

export class DonationRequest{

    constructor({requestId, userId, userName, userAlias,  profileImage, userEmail, userDPI, userGender, userAge, requestMessage, documents, date, selected}){

        this.requestId = requestId || null;
        this.userId = userId;
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
        
    }

    static newRequestOfDonation({productId, requestMessage }) {

        return new Promise((resolve, reject) => {

            const obj = {
                message:requestMessage,
                productId
            }

            let reqObj;

            fetch("/request/newRequest", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": Session.token
                },
                body:JSON.stringify(obj)
            })
            .then(r => {
                reqObj = r;
                return r.json();
            })
            .then(result => {
                console.log(result)
                if(reqObj.ok === true){
                    resolve(result)
                }else{
                    reject(result)
                }
            })
            .catch(err => reject(err));

            
        })
    }

    acceptRequest(){

        return new Promise((resolve, reject) => {

            setTimeout(() =>{
                resolve();
            }, 500)


        });

    }

    rejectRequest(){

        return new Promise((resolve, reject) => {

            setTimeout(() =>{
                resolve();
            }, 5000)


        });

    }

    /**
     * Elimina la solicitud propia de un usuario
     * @returns Promise
     */
    deleteRequest(productId){

        return new Promise((resolve, reject) => {

            const obj = {
                productId
            }
            console.log(obj)
            let reqObj;

            fetch("/request/deleteRequest", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": Session.token
                },
                body:JSON.stringify(obj)
            })
            .then(r => {
                reqObj = r;
                return r.json();
            })
            .then(result => {
                console.log(result)
                if(reqObj.ok === true){
                    resolve(result)
                }else{
                    reject(result)
                }
            })
            .catch(err => reject(err));


        });

    }

    confirmOfReceived(){

        return new Promise((resolve, reject) => {

            if(this.requestId === null) reject("Id de solicitud rechazado.")

            const obj = {
                requestId:this.requestId
            }

            let reqObj;

            fetch("/request/approveRequest", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": Session.token
                },
                body:JSON.stringify(obj)
            })
            .then(r => {
                reqObj = r;
                return r.json();
            })
            .then(result => {

                console.log(result)
                if(reqObj.ok === true){
                    resolve(result)
                }else{
                    reject(result)
                }
            })
            .catch(err => reject(err));


        });

    }

    rejectDonation(){

        return new Promise((resolve, reject) => {

            if(this.requestId === null) reject("Id de solicitud rechazado.")

            const obj = {
                requestId:this.requestId
            }

            let reqObj;

            fetch("/request/rejectRequest", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": Session.token
                },
                body:JSON.stringify(obj)
            })
            .then(r => {
                reqObj = r;
                return r.json();
            })
            .then(result => {

                console.log(result)
                if(reqObj.ok === true){
                    resolve(result)
                }else{
                    reject(result)
                }
            })
            .catch(err => reject(err));


        });

    }

    static getRequests(requestId){

        return new Promise((resolve, reject) => {

            const obj = {
                requestId
            }

            let reqObj;

            fetch("/request/getRequest", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": Session.token
                },
                body:JSON.stringify(obj)
            })
            .then(r => {
                reqObj = r;
                return r.json();
            })
            .then(result => {
                console.log(result)
                debugger
                if(reqObj.ok === true){
                    resolve(result)
                }else{
                    reject(result)
                }
            })
            .catch(err => reject(err));


        });

    }
}