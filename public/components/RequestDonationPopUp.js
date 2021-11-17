import { DonationRequest } from "../scripts/DonationRequest.js";
import { Session } from "../scripts/Session.js";
import { PopUP } from "./PopUp.js";

export class RequestDonationPopUp extends PopUP {

    constructor(productId) {
        super({ closeButton: true, closeWithBackgroundClick: true, maxWidth: 700 });

        this.productId = productId;
        this.actionBlocked = false;
        this.initComponent();


    }

    initComponent() {

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
            <div class="spinner-grow text-primary spinner" role="status"></div>                    
            <p class = "errorMessage">Ocurrió un error </p>
        `;

        $popUpBody.appendChild($popUpBodyContainer);

        //eventos 
        $popUpBody.querySelector("#requestMessage").addEventListener("keyup", e => this.changeButtonStatus());
        $popUpBody.querySelector("#confirmation-check").addEventListener("change", e => this.changeButtonStatus());
        $popUpBody.querySelector("#sendRequest-button").addEventListener("click", e => this.sendRequest())
    }

    changeButtonStatus() {

        const $requestMessage = this.component.querySelector("#requestMessage");
        const $confirmationCheck = this.component.querySelector("#confirmation-check");
        const $button = this.component.querySelector("#sendRequest-button")

        if (!$button) return;

        if (!$requestMessage || !$confirmationCheck) {
            $button.disabled = true;
        } else if ($requestMessage.value.trim() === "" || $confirmationCheck.checked === false) {
            $button.disabled = true;
        } else {
            $button.disabled = false;
        }

    }

    async sendRequest() {

        if (this.actionBlocked === true) return;

        const $requestMessage = this.component.querySelector("#requestMessage");
        const $confirmationCheck = this.component.querySelector("#confirmation-check");

        if (!$requestMessage || !$confirmationCheck) return;

        if (Session.userInSession === true) {
            if ($requestMessage.value.trim() !== "" && $confirmationCheck.checked === true) {

                this.actionBlocked = true;
                this.showSpinner();
                this.hideButton();

                try {
                    await DonationRequest.newRequestOfDonation({
                        productId: this.productId,
                        requestMessage:$requestMessage.value.trim()
                    });

                    if(this.resolve != undefined) this.resolve();

                } catch (ex) {
                    this.showError("Ocurrió un error");
                    this.actionBlocked = false;
                    this.showButton();

                }finally{
                    this.hideSpinner();
                }

                this.close();

                if (this.resolve != undefined) this.resolve();
            }
        } else {
            alert("Usuario no loggeado")
        }


    }

    showButton(){

        const $button = this.component.querySelector("#sendRequest-button")
        if (!$button) return;
        $button.style.display = "block";

    }

    hideButton(){

        const $button = this.component.querySelector("#sendRequest-button")
        if (!$button) return;
        $button.style.display = "none";

    }
}