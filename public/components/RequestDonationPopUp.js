import { Product } from "../scripts/Product.js";
import { Session } from "../scripts/Session.js";
import { PopUP } from "./PopUp.js";

export class RequestDonationPopUp extends PopUP{

    constructor({ productId, closeButton, closeWithBackgroundClick, maxWidth}){
        super({closeButton, closeWithBackgroundClick, maxWidth});

        this.productId = productId;

        this.initComponent();

       
    }

    initComponent(){

        super.initComponent();

        this.component.classList.add("requestDonation")

        const $popUpBody = this.component.querySelector(".popUp-body");
        const $popUpBodyContainer = document.createElement("div");

        $popUpBodyContainer.innerHTML += `
            <img src="../images/icons/charity.png" alt="donation">
            <h3>Solicitud de donación</h3>
            <P>Envía un mensaje para completar tu solicitud.</P>
            <textarea id="requestMessage"></textarea>
            <div class="confirmation-box">
            <input type="checkbox" id="confirmation-check">
            <label for="confirmation-check">Estoy de acuerdo con compartir mis datos personales con el donador.</label>
            </div>
            <button id="sendRequest-button" class="blue-button" disabled>Enviar</button>
        `;

        $popUpBody.appendChild($popUpBodyContainer);

        //eventos 
        $popUpBody.querySelector("#requestMessage").addEventListener("keyup", e => this.changeButtonStatus());
        $popUpBody.querySelector("#confirmation-check").addEventListener("change", e => this.changeButtonStatus());
        $popUpBody.querySelector("#sendRequest-button").addEventListener("click", e => this.sendRequest())
    }

    changeButtonStatus(){

        const $requestMessage = this.component.querySelector("#requestMessage");
        const $confirmationCheck = this.component.querySelector("#confirmation-check");
        const $button = this.component.querySelector("#sendRequest-button")

        if(!$button) return;
        
        if(!$requestMessage || !$confirmationCheck){
            $button.disabled = true;
        }else if($requestMessage.value.trim() === "" || $confirmationCheck.checked === false){
            $button.disabled = true;
        }else{
            $button.disabled = false;
        }

    }

    async sendRequest(){


            const $requestMessage = this.component.querySelector("#requestMessage");
            const $confirmationCheck = this.component.querySelector("#confirmation-check");

            if(!$requestMessage || !$confirmationCheck) return;

            if(Session.userInSession === true){
            if($requestMessage.value.trim() !== "" && $confirmationCheck.checked === true){

                await Product.newRequestOfDonation({
                    user:Session.id,
                    productId:this.productId
                })

                alert("Solicitud enviada exitosamente.");
                this.close();
                
                if(this.resolve != undefined) this.resolve();
            }
        }else{
            alert("Usuario no loggeado")
        }

        
    }
}