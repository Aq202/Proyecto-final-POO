import { AlertPopUp } from "./alertPopUp.js";
import { PopUP } from "./PopUp.js"

export class ManageRequestPopUp extends PopUP {

    constructor(donationRequestObject) {
        super({ closeButton: true, closeWithBackgroundClick: true, maxWidth: 800 });

        this.donationRequestObject = donationRequestObject || {};

        this.userName = this.donationRequestObject?.userName || "Beneficiario";


        this.actionBlocked = false;
        this.initComponent();

    }

    initComponent() {
        super.initComponent();

        let { requestId, userName, userAlias, profileImage, userEmail, userDPI, userGender, userAge, requestMessage, documents } = this.donationRequestObject;
        profileImage ||= "images/profileImages/default.svg";

        this.component.classList.add("manageRequest")

        const $popUpBody = this.component.querySelector(".popUp-body");
        const $popUpBodyContainer = document.createElement("div");

        $popUpBodyContainer.classList.add("popUp-body-container");

        $popUpBodyContainer.innerHTML = `
        <div class="applicant-info">

            <img src="${profileImage}" alt="profile" class="profilePicture">

            <div class="userName">
                <h3>${userName}</h3>
                <h4>@${userAlias}</h4>
            </div>

            <div class="generalData">
                <ul>
                    <li>
                        <strong>Email: </strong>
                        <p>${userEmail}</p>
                    </li>
                    <li>
                        <strong>DPI: </strong>
                        <p>${userDPI}</p>
                    </li>
                    <li>
                        <strong>Sexo: </strong>
                        <p>${userGender}</p>
                    </li>
                    <li>
                        <strong>Edad:</strong>
                        <p>${userAge}</p>
                    </li>
                </ul>
            </div>

            <button class="white-button showDocuments">Documentos</button>
        </div>

        <div class="request-data">
            <h3>Solicitud de Donación</h3>

            <p class="requestMessage scrollbar-gray">${requestMessage} </p>

            <div class="giveEmailCheck manageElement">
                <input type="checkbox" id="send-email">
                <label for="send-email">Estoy de acuerdo en proporcionar mi dirección de email.</label>
            </div>
            
            <div class="manage-buttons manageElement">
                <button class="acceptRequest green-button" disabled>Aceptar</button>
                <button class="rejectRequest red-button">Rechazar</button>
            </div>

            <div class="spinner-grow text-primary spinner" role="status"></div>                    

            <p class = "errorMessage">Ocurrió un error </p>

            <div class="warning manageElement">
                <div class="icon"></div>
                <div class="textInfo">No aceptes ninguna solicitud sin antes verificar la identidad del usuario, a través de sus documentos.</div>
            </div>           


        </div>
        `;

        $popUpBody.appendChild($popUpBodyContainer);

        //eventos
        $popUpBody.querySelector(".showDocuments").addEventListener("click", e => this.showDocumentsGallery());
        $popUpBody.querySelector(".giveEmailCheck input").addEventListener("change", e => this.updateAcceptRequestButtonState(e))
        $popUpBody.querySelector(".acceptRequest").addEventListener("click", e => this.acceptRequest());
        $popUpBody.querySelector(".rejectRequest").addEventListener("click", e => this.rejectRequest());
    }

    showDocumentsGallery() {

        if (this.donationRequestObject?.documents !== undefined && this.donationRequestObject?.documents.length > 0) {

            const imagesObjects = [];

            for (let document of this.donationRequestObject.documents) {
                imagesObjects.push({
                    src: document,
                    type: "image"
                })
            }


            Fancybox.defaults.Hash = false;
            Fancybox.show(imagesObjects);
        }
    }

    updateAcceptRequestButtonState(e) {
        const $button = this.component.querySelector(".acceptRequest");

        if (!$button) return;

        $button.disabled = !e.target.checked;
    }

    async acceptRequest() {

        if (this.actionBlocked === true) return;

        this.hideError();

        const $check = this.component.querySelector(".giveEmailCheck input");
        if (!$check) return;

        if ($check.checked === true) {

            if (confirm("¿Deseas aprobar esta solicitud de donación? Recuerda que no podrás anularlo posteriormente.")) {

                try {

                    this.actionBlocked = true;
                    this.hideManageElements();
                    this.showSpinner();

                    await this.donationRequestObject.acceptRequest();

                    //solicitud aceptada correctamente

                    const alertPopUp = new AlertPopUp({
                        imgUrl: "../images/others/thanks.svg",
                        title: "¡Tu donación se ha realizado con éxito!",
                        text: `A continuación notificaremos a ${this.userName} para que puedan ponerse en contacto. Recuerda que aún falta que tu beneficiario confirme de recibida la donación.<br> <b>¡Muchas Gracias!</b>`
                    });

                    try {
                        this.close();
                        await alertPopUp.open();
                    } catch (ex) {
                        console.error(ex)
                    } finally {
                        if (this.resolve !== undefined) this.resolve({ requestAccepted: true }); //se devuelve la promesa inicial
                    }



                } catch (ex) {
                    console.log(ex)
                    this.showError("Ocurrió un error.")
                    this.showManageElements();
                    this.actionBlocked = false;

                } finally {
                    this.hideSpinner();
                }

            }
        }

    }

    async rejectRequest() {
        if (this.actionBlocked === true) return;

        const $check = this.component.querySelector(".giveEmailCheck input");
        if (!$check) return;

        if (confirm("¿Deseas rechazar esta solicitud de donación? Recuerda que no podrás reestablecerla posteriormente.")) {

            try {
                this.actionBlocked = true;
                this.hideManageElements();
                this.showSpinner();
                await this.donationRequestObject.rejectRequest();

                //eliminada correctamente
                const alertPopUp = new AlertPopUp({
                    imgUrl: "../images/others/working.svg",
                    title: "Solicitud rechazada con éxito",
                    text: `Estamos seguros que podrás hallar a esa persona ideal, ¡sigue intentándolo!`
                });

                try {
                    this.close();
                    await alertPopUp.open();
                } catch (ex) {
                    console.error(ex)
                } finally {
                    if (this.resolve !== undefined) this.resolve({ requestAccepted: false }); //se devuelve la promesa inicial
                }

            } catch (ex) {
                this.showError("Ocurrió un error.")
                this.showManageElements();
                this.actionBlocked = false;
            }

        }

    }

    showError(error) {

        const $error = this.component.querySelector(".errorMessage");
        if (!$error) return;

        $error.style.display = "block";
        $error.innerText = error || "";

    }

    hideError() {
        const $error = this.component.querySelector(".errorMessage");
        if (!$error) return;

        $error.style.display = "none";
    }

    hideManageElements() {

        const $manageElements = this.component.querySelectorAll(".manageElement");
        if (!$manageElements) return;

        $manageElements.forEach(elem => {
            elem.style.display = "none";
        })
    }

    showManageElements() {

        const $manageElements = this.component.querySelectorAll(".manageElement");
        if (!$manageElements) return;

        $manageElements.forEach(elem => {
            elem.style.display = "flex";
        })
    }

    showSpinner() {

        const $spinner = this.component.querySelectorAll(".spinner");
        if (!$spinner) return;

        $($spinner).fadeIn(300);

    }

    hideSpinner() {
        const $spinner = this.component.querySelectorAll(".spinner");
        if (!$spinner) return;

        $($spinner).hide();
    }
}