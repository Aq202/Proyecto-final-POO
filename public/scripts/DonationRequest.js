export class DonationRequest{

    constructor({requestId, userId, userName, userAlias,  profileImage, userEmail, userDPI, userGender, userAge, requestMessage, documents, date, selected}){

        this.requestId = requestId;
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

    deleteRequest(){

        return new Promise((resolve, reject) => {

            setTimeout(() =>{
                resolve();
            }, 5000)


        });

    }

    confirmOfReceived(){

        return new Promise((resolve, reject) => {

            setTimeout(() =>{
                resolve();
            }, 5000)


        });

    }

    rejectDonation(){

        return new Promise((resolve, reject) => {

            setTimeout(() =>{
                resolve();
            }, 5000)


        });

    }
}