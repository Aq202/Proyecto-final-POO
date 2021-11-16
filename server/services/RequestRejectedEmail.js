const Email = require("./Email");

module.exports = class RequestRejectedEmail extends Email{

    constructor({userName, userEmail, productName}){

        super({addresseeEmail:userEmail, subject:"¡Tu solicitud de donación ha sido aceptada!", userName});

        this.productName = productName;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
    }

    sendEmail(){

        const message = `
        
        Estamos muy emocionados de informarte que tu solicitud de donación del producto: <b>${this.productName}</b> ha sido aprobada recientemente.
        Te recomendamos que te pongas en contacto con el donador lo antes posible para concretar la donación.
        <br><br>
        Además, te solicitamos que una vez hayas recibido de manera física el producto, te dirigas a nuestro sitio y lo marques como recibido, para que el donador pueda recibir su crédito.
        <br><br>
        <b>Información de contacto</b>
        <br>
        Nombre: ${this.ownerName} <br>
        Email: ${this.ownerEmail} <br>        
        `;

        this.message = message;
        super.sendEmail();
    }


}