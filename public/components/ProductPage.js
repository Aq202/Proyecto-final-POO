import { ImageViewer } from "./ImageViewer.js";
import { Product } from "../scripts/Product.js";
import { RequestDonationPopUp } from "./RequestDonationPopUp.js";
import { UnauthorizedPopUp } from "./UnauthorizedPopUp.js";
import { DonationRequestsContainer } from "./DonationRequestsContainer.js";
import { Session } from "../scripts/Session.js";

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
                    <div id="productInfo-container" class="productInfo-section">
            
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
        if (this.isOwner === true) {

            const donationRequests = new DonationRequestsContainer({
                requests: [
                    {
                        requestId: "a",
                        userId: "b",
                        userName: "Diego Morales",
                        userAlias: "dgo202",
                        profileImage: "images/profileImages/1.jpg",
                        userEmail: "diegoguatedb2002@gmail.com",
                        userDPI: "3943011290101",
                        userGender: "Masculino",
                        userAge: 18,
                        requestMessage: "La verdad no lo quiero, lo necesito xd",
                        documents: [
                            "http://cdn.shopify.com/s/files/1/0101/2522/files/dslr-manual-focus_grande.jpg?3541"
                        ],
                        date: new Date(),
                        selected: false
                    }
                ]
            });
            this.component.querySelector("#productInfo").appendChild(donationRequests.component);


        }

        //agregar eventos
        $productPage.querySelector("button#deleteProduct-button").addEventListener("click", e => this.deleteProduct());
        $productPage.querySelector("button#makeRequest-button").addEventListener("click", e => this.makeNewRequest());
        $productPage.querySelector("button#deleteRequest-button").addEventListener("click", e => this.deleteRequest());
        $productPage.querySelector("button#confirmOfReceived-button").addEventListener("click", e => this.confirmOfReceived());
        $productPage.querySelector("button#rejectDonation-button").addEventListener("click", e => this.confirmOfReceived());

        document.addEventListener("requestAccepted", e => this.updateProductState());


    }

    selectActionElements() {

        try {
            this.hideButtons();

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

                if (this.alreadyRequested !== true && this.selectedAsBeneficiary !== true && this.donationRequestAccepted !== true) { //estado inicial

                    $(this.component.querySelector("#makeRequest-button")).show();

                } else if (this.alreadyRequested === true && this.selectedAsBeneficiary !== true && this.donationRequestAccepted !== true) { //solicitud realizada

                    $(this.component.querySelector("#deleteRequest-button")).show();

                } else if (this.selectedAsBeneficiary === true && this.donationReceivedConfirmed !== true) { //elegido como beneficiario

                    $(this.component.querySelector("#confirmOfReceived-button")).show();
                    $(this.component.querySelector("#rejectDonation-button")).show();

                    this.addMessage({ message: "Confirma la donación hasta que recibas físicamente el producto.", red: true });

                } else if (this.selectedAsBeneficiary === true && this.donationReceivedConfirmed) { //donacion confirmada

                    this.addMessage({ message: "¡Donación recibida correctamente!", green: true })

                } else if (this.selectedAsBeneficiary !== true && this.donationRequestAccepted === true) { //donacion no disponible

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

    verifySession(){

        if(Session.userInSession !== true){
            new UnauthorizedPopUp().open();
            return false;
        }else{
            return true;
        }

    }

    deleteProduct(){
        if(!this.verifySession()) return;
        if(this.isOwner !== true) return;
        if (!(this.donationRequestAccepted !== true && this.donationReceived !== true)) return;

        alert("Eliminar donacion")

    }

    async makeNewRequest(){
        if(!this.verifySession()) return;
        if(this.isOwner === true) return;
        if (!(this.alreadyRequested !== true && this.selectedAsBeneficiary !== true && this.donationRequestAccepted !== true)) return;

        const popUp = new RequestDonationPopUp(this.productId);
        await popUp.open();
        
    }
    
    deleteRequest(){
        if(!this.verifySession()) return;
        if(this.isOwner === true) return;
        if (!(this.alreadyRequested === true && this.selectedAsBeneficiary !== true && this.donationRequestAccepted !== true)) return;

        alert("Eliminado");
        
    }
    confirmOfReceived(){
        if(!this.verifySession()) return;
        if(this.isOwner === true) return;
        if (!(this.selectedAsBeneficiary === true && this.donationReceivedConfirmed !== true)) return;

        alert("Confirmando de recibido");
        
    }
    rejectDonation(){
        if(!this.verifySession()) return;
        if(this.isOwner === true) return;
        if (!(this.selectedAsBeneficiary === true && this.donationReceivedConfirmed !== true)) return;

        alert("Rechazando donacion");
        
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


}