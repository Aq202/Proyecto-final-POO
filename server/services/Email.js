
const nodemailer = require('nodemailer')

module.exports = class Email{

    
    constructor({addresseeEmail, subject, userName, message}) {

        this._transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'myturnfoundation@gmail.com',
                pass: 'proyectofinalpoo2021'
            }
        });

        this.addresseeEmail = addresseeEmail || "";
        this.subject = subject || "Fundación MyTurn";
        this.userName = userName || "Usuario";
        this._message = message || "";

        this.emailBody = this.getMessageBody();
    }

    getMessageBody() {

        return  `
            <div style='background:#0c4271; color:white; font-family:helvetica; font-size:30px;  width:100%;  text-align: center; padding: 15px 5px 15px 5px; box-sizing: border-box;'>Fundación MyTurn</div>
            <div style='width:100%;  border: 1px solid #f0f0f0; border-bottom: 1px solid #c0c0c0; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; background: rgb(250,250,250);  padding: 25px 25px 35px 25px; font-family: helvetica; box-sizing: border-box;'>

                <center>
                    <h2 style="text-decoration: underline;">${this.subject}</h2>
                </center>

                <p style="text-align: justify; font-size:16px;">
                    Hola ${this.userName},
                    <br>
                    <br>
                    <br>
                    ${this._message}
                    <br>
                    <br>
                    <br>
                    MyTurn team.
                
                </p>

            </div>
        `;
    }

    set message(message){

        this._message = message;
        this.emailBody = this.getMessageBody();
    }


    sendEmail() {

       const mailOptions = {
            from: 'MyTurn Team',
            to: this.addresseeEmail,
            subject: this.subject,
            html: this.emailBody,

        };

        console.log(mailOptions)

        this._transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("No se pudo enviar el email. ", error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}