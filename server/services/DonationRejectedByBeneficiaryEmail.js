const Email = require("./Email");

module.exports = class DonationRejectedByBeneficiary extends Email{

    constructor({ownerName, ownerEmail, beneficiaryName, productName}){

        super({addresseeEmail:ownerEmail, subject:"Donación rechazada por el beneficiario", userName:ownerName});

        this.productName = productName;
        this.beneficiaryName  = beneficiaryName;
    }

    sendEmail(){

        const message = `
        
            Te notificamos que tu beneficiario <b>${this.beneficiaryName}</b> ha rechazado la donación del producto <b>${this.productName}</b>.
            <br><br>
            Estamos seguros que agradece mucho tu confianza, pero es una nueva oportunidad para ayudar a alguien más.
        `;

        this.message = message;
        super.sendEmail();
    }


}