import { PopUP } from "./PopUp.js";

export class AlertPopUp extends PopUP{

    constructor({imgUrl, title, text}) {
        super({ closeButton: true, closeWithBackgroundClick: true, maxWidth: 600 });

        this.imgUrl = imgUrl;
        this.title = title;
        this.text = text;

        this.initComponent();
    }

    initComponent() {
        super.initComponent();

        this.component.classList.add("alert")

        const $popUpBody = this.component.querySelector(".popUp-body");
        const $popUpBodyContainer = document.createElement("div");
        

        $popUpBodyContainer.innerHTML = `
        
            <img src="${this.imgUrl}" alt="unauthorized">
            <h3>${this.title}</h3>
            <p>${this.text}</p>
            <div class="buttons">
                <button class="blue-button accept">Aceptar</button>
            </div>
        `;
        $popUpBody.appendChild($popUpBodyContainer);

        //close button
        this.component.querySelector("button.accept").addEventListener("click", () => {
            this.close();
            if(this.resolve !== undefined) this.resolve();
        })

    }


}