const Email = require("./Email");

module.exports = class RequestRejectedEmail extends Email{

    constructor({userName, userEmail, productName}){

        super({addresseeEmail:userEmail, subject:"Solicitud de donación rechazada", userName});

        this.productName = productName;
    }

    sendEmail(){

        const message = `
        
            Te notificamos que tu solicitud de donación para el producto <b>${this.productName}</b> ha sido rechazada.
            <br><br>
            Te invitamos a seguir explorando los diferentes productos que tenemos disponibles para ti.
        `;

        this.message = message;
        super.sendEmail();
    }


}