import { ImageViewer } from "./ImageViewer.js";
import { Product } from "../scripts/Product.js";
import { RequestDonationPopUp } from "./RequestDonationPopUp.js";
import { UnauthorizedPopUp } from "./UnauthorizedPopUp.js";
import { DonationRequestsContainer } from "./DonationRequestsContainer.js";
import { Session } from "../scripts/Session.js";
import { DonationRequest } from "../scripts/DonationRequest.js";
import { AlertPopUp } from "./alertPopUp.js";
import { Filter } from "../scripts/Filter.js";
export class ProductPage {

    constructor({ productId, cathegory, department, municipality, title, description, profileImage, name, productImages, isOwner, alreadyRequested, selectedAsBeneficiary, donationRequestAccepted, donationReceivedConfirmed, userRequestId, available }) {

        this.productId = productId || null;
        this.category = cathegory;
        this.department = department;
        this.municipality = municipality;
        this.title = title;
        this.description = description;
        this.profileImage = profileImage || "images/profileImages/default.svg";;
        this.authorName = name;
        this.productImages = productImages;
        this.isOwner = isOwner || false;
        this.alreadyRequested = alreadyRequested || false;
        this.selectedAsBeneficiary = selectedAsBeneficiary || false;
        this.donationRequestAccepted = donationRequestAccepted || false;
        this.donationReceivedConfirmed = donationReceivedConfirmed || false;
        this.userRequestId = userRequestId || undefined;
        this.available = available ?? true;

        if (!this.userRequestId) this.userRequestObject = new DonationRequest({ requestId: this.userRequestId });

        this.actionBlocked = false;

        this.initComponent();

    }

    initComponent() {

        this.component = document.createElement("div");
        const $productPage = this.component;

        $productPage.id = "productPage";

        $productPage.innerHTML = `
            <div id="productPage-container">
        
                <div id="main-product-container">
            
                    <div id="productImage"></div>
                    <div id="productInfo">
                    <div id="productInfo-container" class="productInfo-section">
            
                        <div class="tags">
                            <span id="cathegory">${this.category}</span>
                            <span class="separator">|</span>
                            <span id="place">${this.municipality}</span>
                        </div>
            
                        <h1 id="product-title">${this.title}</h1>
            
                        <div id="product-author">
                            <img src="${this.profileImage}" alt="profile">
                            <span>${this.authorName}</span>
                        </div>
            
                        <p id="product-description">${this.description}</p>
            
                        <div id="product-buttons">
                            <button id="deleteProduct-button" class="red-button product-button">Eliminar</button>
                            <button id="makeRequest-button" class="blue-button product-button">Solicitar</button>
                            <button id="deleteRequest-button" class="red-button product-button">Eliminar Solicitud</button>
                            <button id="confirmOfReceived-button" class="green-button product-button">Confirmar</button>
                            <button id="rejectDonation-button" class="red-button product-button">Rechazar</button>
                        </div>

                        <div class="spinner-grow text-primary spinner" role="status"></div>                    

                        <p class = "errorMessage">Ocurrió un error.</p>

                        <div class="statusInfo">
                            <div class="icon"></div>
                            <div class="textInfo">El autor se encuentra analizando tu solicitud.</div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        
        `;

        //añadir visor de imagenes
        const imageViewer = new ImageViewer();
        for (let imageUrl of this.productImages) {
            imageViewer.addImage(imageUrl);
        }

        $productPage.querySelector("#productImage").appendChild(imageViewer.component);

        this.selectActionElements();


        //añadir seccion de solicitudes (si es el autor)
        this.addDonationRequests();

        //agregar eventos
        $productPage.querySelector("button#deleteProduct-button").addEventListener("click", e => this.deleteProduct());
        $productPage.querySelector("button#makeRequest-button").addEventListener("click", e => this.makeNewRequest());
        $productPage.querySelector("button#deleteRequest-button").addEventListener("click", e => this.deleteRequest());
        $productPage.querySelector("button#confirmOfReceived-button").addEventListener("click", e => this.confirmOfReceived());
        $productPage.querySelector("button#rejectDonation-button").addEventListener("click", e => this.rejectDonation());
        $productPage.querySelector("#cathegory").addEventListener("click", e => this.searchSimilarCategories());
        $productPage.querySelector("#place").addEventListener("click", e => this.searchSimilarMunicipalities());

        document.addEventListener("requestAccepted", e => this.updateProductState());


    }

    async addDonationRequests() {

        if (this.isOwner === true) {

            const requests = await DonationRequest.getRequests(this.productId);

            if (requests.length > 0) {

                const donationRequests = new DonationRequestsContainer({requests});
                this.component.querySelector("#productInfo").appendChild(donationRequests.component);

            }


        }

    }

    selectActionElements() {

        try {
            this.hideButtons();
            this.hideMessage();

            //si es el autor
            if (this.isOwner === true) {

                if (this.donationRequestAccepted !== true && this.donationReceived !== true) { // estado inicial

                    $(this.component.querySelector("#deleteProduct-button")).show();

                } else if (this.donationRequestAccepted === true && this.donationReceivedConfirmed !== true) { //en espera de confirmacion del beneficiario

                    this.addMessage({ message: "En espera de la confirmación de recibido del usuario." })

                } else if (this.donationReceivedConfirmed) { //confirmacion recibida

                    this.addMessage({ message: "¡Donación completada!", green: true })

                }

            }
            //no es el autor
            else {

                
               

                if (this.available !== false && this.alreadyRequested !== true && this.selectedAsBeneficiary !== true && this.donationRequestAccepted !== true) { //estado inicial

                    $(this.component.querySelector("#makeRequest-button")).show();

                } else if (this.available !== false && this.alreadyRequested === true && this.selectedAsBeneficiary !== true && this.donationRequestAccepted !== true) { //solicitud realizada

                    $(this.component.querySelector("#deleteRequest-button")).show();

                } else if (this.selectedAsBeneficiary === true && this.donationReceivedConfirmed !== true) { //elegido como beneficiario

                    $(this.component.querySelector("#confirmOfReceived-button")).show();
                    $(this.component.querySelector("#rejectDonation-button")).show();

                    this.addMessage({ message: "Confirma la donación hasta que recibas físicamente el producto.", red: true });

                } else if (this.selectedAsBeneficiary === true && this.donationReceivedConfirmed) { //donacion confirmada

                    this.addMessage({ message: "¡Donación recibida correctamente!", green: true })

                } else if (this.available === false || (this.selectedAsBeneficiary !== true && this.donationRequestAccepted === true)) { //donacion no disponible

                    this.addMessage({ message: "Esta donación ya no se encuentra disponible.", red: true })
                }
           

            }
        } catch (ex) {

        }
    }

    hideButtons() {

        const $buttons = this.component.querySelectorAll(".product-button");
        if (!$buttons) return;

        $buttons.forEach(elem => {
            elem.style.display = "none";
        })

    }

    verifySession() {

        if (Session.userInSession !== true) {
            new UnauthorizedPopUp().open();
            return false;
        } else {
            return true;
        }

    }

    async deleteProduct() {
        if (this.actionBlocked === true) return;
        if (!this.verifySession()) return;
        if (this.isOwner !== true) return;
        if (!(this.donationRequestAccepted !== true && this.donationReceived !== true)) return;

        if ("¿Estás seguro que deseas eliminar permanentemente este producto?") {

            this.actionBlocked = true;
            this.hideButtons();
            this.showSpinner();

            try {

                await Product.deleteProduct(this.productId);


                const alertPopUp = new AlertPopUp({
                    imgUrl: "../images/others/working.svg",
                    title: "Tu producto se ha eliminado correctamente",
                    text: "Agradecemos mucho tu confianza, esperamos verte de nuevo para continuar en esta cruzada por hacer de este un mundo mejor."
                });

                this.hideSpinner();
                await alertPopUp.open();

                location.hash = "/";

            } catch (ex) {
                this.hideSpinner();
                this.showError(ex);
                this.actionBlocked = false;
                this.selectActionElements();
            }

        }
    }

    async makeNewRequest() {

        if (this.actionBlocked === true) return;
        if (!this.verifySession()) return;
        if (this.isOwner === true) return;
        if (!(this.alreadyRequested !== true && this.selectedAsBeneficiary !== true && this.donationRequestAccepted !== true)) return;

        try {
            const popUp = new RequestDonationPopUp(this.productId);
            await popUp.open();

            const alertPopUp = new AlertPopUp({
                imgUrl: "../images/others/charity-market.svg",
                title: "¡Tu solicitud se ha realizado correctamente!",
                text: "Ahora no queda más que cruzar los dedos y ser paciente por la respuesta del autor. Te notificaremos en cuento tengamos noticias."
            });

            await alertPopUp.open();

            //Solicitud aceptada
            this.alreadyRequested = true;
            this.selectActionElements();

        } catch (ex) {

        }

    }

    async deleteRequest() {

        if (this.actionBlocked === true) return;
        if (!this.verifySession()) return;
        if (this.isOwner === true) return;
        if (!(this.alreadyRequested === true && this.selectedAsBeneficiary !== true && this.donationRequestAccepted !== true)) return;

        if (this.userRequestObject !== undefined) {

            if (confirm("¿Deseas eliminar tu solicitud para este producto?")) {

                try {
                    this.actionBlocked = true;
                    this.showSpinner();
                    this.hideButtons();

                    await this.userRequestObject.deleteRequest(this.productId);

                    const alertPopUp = new AlertPopUp({
                        imgUrl: "../images/others/working.svg",
                        title: "Tu solicitud se ha eliminado correctamente",
                        text: "Estamos seguros que alguien más podrá aprovecharlo al máximo. Te invitamos a seguir explorando para encontrar más productos que sean para tí."
                    });

                    this.alreadyRequested = false;
                    this.hideSpinner();
                    this.selectActionElements();

                    await alertPopUp.open();

                    this.actionBlocked = false;


                } catch (ex) {

                    this.hideSpinner();
                    this.selectActionElements();
                    this.showError(ex);
                    this.actionBlocked = false;

                }
            }

        }

    }

    async confirmOfReceived() {
        if (this.actionBlocked === true) return;
        if (!this.verifySession()) return;
        if (this.isOwner === true) return;
        if (!(this.selectedAsBeneficiary === true && this.donationReceivedConfirmed !== true)) return;

        if (this.userRequestObject !== undefined) {

            if (confirm("¿Deseas confirmar de que haz recibido físicamente este producto?")) {

                try {
                    this.actionBlocked = true;
                    this.showSpinner();
                    this.hideButtons();

                    await DonationRequest.confirmOfReceived(this.productId);

                    const alertPopUp = new AlertPopUp({
                        imgUrl: "../images/others/celebration.svg",
                        title: "¡La donación se ha completado correctamente!",
                        text: "Estamos muy felices por tí, esperamos que puedas aprovecharlo al máximo. <b>¡Felicidades!</b>"
                    });

                    this.donationReceivedConfirmed = true;
                    this.hideSpinner();
                    this.selectActionElements();

                    await alertPopUp.open();

                } catch (ex) {
                    ex ||= "Ocurrió un error.";
                    this.hideSpinner();
                    this.selectActionElements();
                    this.showError(ex);

                } finally {
                    this.actionBlocked = false;
                }
            }

        }
    }

    async rejectDonation() {
        if (this.actionBlocked === true) return;
        if (!this.verifySession()) return;
        if (this.isOwner === true) return;
        if (!(this.selectedAsBeneficiary === true && this.donationReceivedConfirmed !== true)) return;

        if (this.userRequestObject !== undefined) {

            if (confirm("¿Deseas rechazar esta donación? Recuerda que el autor de esta publicación te ha seleccionado y al completar con esta acción, el producto volverá a estar disponible para todos.")) {

                try {
                    this.actionBlocked = true;
                    this.showSpinner();
                    this.hideButtons();
               
                    await DonationRequest.rejectDonation(this.productId);

                    const alertPopUp = new AlertPopUp({
                        imgUrl: "../images/others/working.svg",
                        title: "La donación ha sido rechazada",
                        text: "Bueno... La proxima vez será."
                    });

                    this.alreadyRequested = false;
                    this.selectedAsBeneficiary = false;
                    this.donationRequestAccepted = false;
                    this.donationReceivedConfirmed = false;
                    this.available = true;
                    this.userRequestId = undefined;
                    this.userRequestObject = undefined;

                    this.hideSpinner();
                    this.selectActionElements();

                    await alertPopUp.open();

                } catch (ex) {
                    ex ||= "Ocurrió un error.";
                    this.hideSpinner();
                    this.selectActionElements();
                    this.showError(ex);

                } finally {
                    this.actionBlocked = false;
                }

                let array1 = [1,2,3,4]

            }
        }

    }

    async openPopUp() {

        //const popUp = new RequestDonationPopUp({closeWithBackgroundClick:true, productId:this.productId});
        //await popUp.open()

        //alert("Modificando boton")

        const popUp = new UnauthorizedPopUp();
        popUp.open();
    }

    addMessage({ message, red, green }) {
        red ||= false;

        const $statusInfo = this.component.querySelector(".statusInfo");
        if (!$statusInfo) return;

        $statusInfo.style.display = "flex";

        const $textContainer = $statusInfo.querySelector("div.textInfo");
        if ($textContainer) $textContainer.innerText = message || "";

        if (red === true) $statusInfo.classList.add("red-icon");
        else if (green === true) $statusInfo.classList.add("green-icon");
        else $statusInfo.classList.remove("red-icon");
    }

    hideMessage() {
        const $statusInfo = this.component.querySelectorAll(".statusInfo");
        if (!$statusInfo) return;

        $($statusInfo).hide();
    }

    updateProductState() {
        this.donationRequestAccepted = true;
        this.selectButtonStyle();
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

    searchSimilarCategories() {

        if (this.category !== undefined) {
            Filter.clearFilters();
            Filter.addCategory({ category: this.category })
            location.hash = "#/";
        }
    }

    async searchSimilarMunicipalities() {

        if (this.department !== undefined && this.municipality !== undefined) {

            Filter.blockEvent = true;
            Filter.clearFilters();
            await Filter.setDepartment(this.department);
            await Filter.setMunicipality(this.municipality);
            Filter.blockEvent = false;
            console.log(Filter.filters)
            location.hash = "#/";

        }
    }


}