import { PopUP } from "./PopUp.js";

export class UnauthorizedPopUp extends PopUP {

    constructor(restringed) {
        super({ closeButton: true, closeWithBackgroundClick: true, maxWidth: 600 });

        if(restringed === true){
            this.closeButton = false;
            this.closeWithBackgroundClick = false;
        }


        this.initComponent();
    }

    initComponent() {
        super.initComponent();

        this.component.classList.add("unauthorized")

        const $popUpBody = this.component.querySelector(".popUp-body");
        const $popUpBodyContainer = document.createElement("div");

        $popUpBodyContainer.classList.add("popUp-body-container")
        

        $popUpBodyContainer.innerHTML = `
        
            <img src="../images/icons/stop.png" alt="unauthorized">
            <h3>Debes de iniciar Sesión</h3>
            <div class="buttons">
                <button class="empty-blue-button register">Registrate</button>
                <button class="blue-button login">Iniciar Sesión</button>
            </div>
        `;
        $popUpBody.appendChild($popUpBodyContainer);

        //eventos
        $popUpBody.querySelector(".register").addEventListener("click", e => {

            this.fastClose();
            if(this.reject != undefined) this.reject();
            window.location.hash = "/"
        })

        $popUpBody.querySelector(".login").addEventListener("click", e => {

            this.fastClose();
            if(this.reject != undefined) this.reject();
            window.location.hash = "/#/login?back=true"
        })

    }
}