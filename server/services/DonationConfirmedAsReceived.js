const Email = require("./Email");

module.exports = class DonationConfirmedAsReceived extends Email{

    constructor({ownerName, ownerEmail, beneficiaryName, productName}){

        super({addresseeEmail:ownerEmail, subject:"Donación confirmada como recibida", userName:ownerName});

        this.productName = productName;
        this.beneficiaryName  = beneficiaryName;
    }

    sendEmail(){

        const message = `
        
            Te notificamos que tu beneficiario <b>${this.beneficiaryName}</b> ya ha confirmado de recibido el producto <b>${this.productName}</b>.
            <br><br>
            Te agradecemos por haber confiado en nosotros para ayudarte a hacer de este mundo un lugar mejor.
        `;

        this.message = message;
        super.sendEmail();
    }


}