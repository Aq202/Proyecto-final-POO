const Email = require("./Email");

module.exports = class NewRequestEmail extends Email{

    constructor({ownerName, ownerEmail, applicantName, productName}){

        super({addresseeEmail:ownerEmail, subject:"Nueva solicitud de donación", userName:ownerName});

        this.productName = productName;
        this.applicantName = applicantName;
    }

    sendEmail(){

        const message = `
        
            Te notificamos que se ha recibido una nueva solicitud para tu producto <b>${this.productName}</b> por parte de <b>${this.applicantName}</b>.
            <br><br>
            Te invitamos a que te dirijas a la página de tu producto para que puedas analizar y dar respuesta a esta nueva solicitud.
        `;

        this.message = message;
        super.sendEmail();
    }


}