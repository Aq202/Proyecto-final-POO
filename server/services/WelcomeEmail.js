const Email = require("./Email");

module.exports = class WelcomeEmail extends Email{

    constructor({userName, userEmail}){

        super({addresseeEmail:userEmail, subject:"¡Bienvenido a MyTurn!", userName});

    }

    sendEmail(){

        const message = `
        
            Tu cuenta se ha creado exitosamente, estamos muy felices de tenerte con nostros, tu cruzada por hacer de este mundo mejor ha comenzado.
            <br><br>
            ¡Es tu turno de ayudar!
        `;

        this.message = message;
        super.sendEmail();
    }


}