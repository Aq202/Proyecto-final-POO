import { PopUP } from "./PopUp.js";

export class UnauthorizedPopUp extends PopUP {

    constructor() {
        super({ closeButton: true, closeWithBackgroundClick: true, maxWidth: 550 });

        this.initComponent();
    }

    initComponent() {
        super.initComponent();

        this.component.classList.add("unauthorized")

        const $popUpBody = this.component.querySelector(".popUp-body");
        const $popUpBodyContainer = document.createElement("div");

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
        $popUpBody.querySelector(".register").addEventListener("click", async e => {

            await this.close();
            if(this.reject != undefined) this.reject();
            window.location.hash = "/"
        })

        $popUpBody.querySelector(".login").addEventListener("click", async e => {

            await this.close();
            if(this.reject != undefined) this.reject();
            window.location.hash = "/#/login?back=true"
        })

    }
}