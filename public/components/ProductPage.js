import { ImageViewer } from "./ImageViewer.js";
import { Product } from "../scripts/Product.js";
import { RequestDonationPopUp } from "./RequestDonationPopUp.js";
import { UnauthorizedPopUp } from "./UnauthorizedPopUp.js";

export class ProductPage {

    constructor({ productId, cathegory, municipality, title, description, profileImage, name, productImages, isOwner, alreadyRequested, selectedAsBeneficiary, donationRequestAccepted, donationReceivedConfirmed }) {

        this.productId = productId || null;
        this.cathegory = cathegory;
        this.municipality = municipality;
        this.title = title;
        this.description = description;
        this.profileImage = profileImage;
        this.authorName = name;
        this.productImages = productImages;
        this.isOwner = isOwner || false;
        this.alreadyRequested = alreadyRequested || false;
        this.selectedAsBeneficiary = selectedAsBeneficiary || false;
        this.donationRequestAccepted = donationRequestAccepted || false;
        this.donationReceivedConfirmed = donationReceivedConfirmed || false;

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
            <div id="productInfo-container">
    
                <div class="tags">
                    <span id="cathegory">${this.cathegory}</span>
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
                    <button id="action-button"></button>
                    <button id="action-button2"></button>
                </div>

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

        this.selectButtonStyle();

        //agregar eventos
        $productPage.querySelector("button#action-button").addEventListener("click", e => this.selectAction());
        $productPage.querySelector("button#action-button2").addEventListener("click", e => this.selectAction2());

    }

    selectButtonStyle() {

        const $button = this.component.querySelector("button#action-button");
        const $button2 = this.component.querySelector("button#action-button2");

        if (!$button || !$button2) return;

        this.resetButtonStyle($button, $button2)

        //si es el autor
        if (this.isOwner === true) {

            if (this.donationRequestAccepted !== true && this.donationReceived !== true) { // estado inicial
                $button.style.display = "block";
                $button.classList.add("red-button");
                $button.innerText = "Eliminar";

            } else if (this.donationRequestAccepted === true && this.donationReceivedConfirmed !== true) { //en espera de confirmacion del beneficiario

                this.addMessage({ message: "En espera de la confirmación de recibido del usuario." })

            } else if (this.donationReceivedConfirmed) { //confirmacion recibida

                this.addMessage({ message: "¡Donación completada!", green: true })

            }

        }
        //no es el autor
        else {

            if (this.alreadyRequested !== true && this.selectedAsBeneficiary !== true && this.donationRequestAccepted !== true) { //estado inicial

                $button.style.display = "block";
                $button.classList.add("blue-button");
                $button.innerText = "Solicitar";

            } else if (this.alreadyRequested === true && this.selectedAsBeneficiary !== true && this.donationRequestAccepted !== true) { //solicitud realizada

                $button.style.display = "block";
                $button.classList.add("red-button");
                $button.innerText = "Eliminar solicitud";
                this.addMessage({ message: "El propietario se encuentra analizando tu solicitud." })

            } else if (this.selectedAsBeneficiary === true && this.donationReceivedConfirmed !== true) { //elegido como beneficiario

                $button.style.display = "block";
                $button.classList.add("green-button");
                $button.innerText = "Confirmar";

                $button2.classList.add("red-button");
                $button2.innerText = "Rechazar";
                $button2.style.display = "block";
                this.addMessage({ message: "Confirma la donación hasta que recibas físicamente el producto.", red: true });

            } else if (this.selectedAsBeneficiary === true && this.donationReceivedConfirmed) { //donacion confirmada

                this.addMessage({ message: "¡Donación recibida correctamente!", green: true })

            } else if (this.selectedAsBeneficiary !== true && this.donationRequestAccepted === true) { //donacion no disponible

                this.addMessage({ message: "Esta donación ya no se encuentra disponible.", red: true })
            }

        }
    }

    resetButtonStyle(button1, button2) {

        if (!button1 || !button2) return;

        button1.removeAttribute("class");
        button2.removeAttribute("class");
        button1.style.display = "none";
        button2.style.display = "none";

    }

    selectAction() {

        if (this.isOwner === true) {

            if (this.donationRequestAccepted !== true && this.donationReceived !== true) { // estado inicial
                
                alert("ELIMINAR DONACION")

            } 
        }
        //no es el autor
        else {

            if (this.alreadyRequested !== true && this.selectedAsBeneficiary !== true && this.donationRequestAccepted !== true) { //estado inicial

                this.openPopUp();

            }else if (this.alreadyRequested === true && this.selectedAsBeneficiary !== true && this.donationRequestAccepted !== true) { //eliminar solicitud

                alert("eliminar solicitud")

            }else if (this.selectedAsBeneficiary === true && this.donationReceivedConfirmed !== true) { // accion de confirmar

                alert("confirmando...")

            } 
        }

    }

    selectAction2(){

        if (this.selectedAsBeneficiary === true && this.donationReceivedConfirmed !== true) { // accion de rechazar donacion

            alert("Rechazando donación...")

        } 

    }

    async openPopUp() {

        //const popUp = new RequestDonationPopUp({closeWithBackgroundClick:true, productId:this.productId});
        //await popUp.open()

        //alert("Modificando boton")

        const popUp = new UnauthorizedPopUp();
        popUp.open();
        console.log("hola")
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
}