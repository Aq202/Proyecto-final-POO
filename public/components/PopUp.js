export class PopUP {

    constructor({ closeButton, closeWithBackgroundClick, maxWidth }) {

        this.closeButton = closeButton || true;
        this.closeWithBackgroundClick = closeWithBackgroundClick || false;
        this.maxWidth = maxWidth || 700;
        this.opened = false;

        if (isNaN(this.maxWidth)) this.maxWidth = 700;

    }

    initComponent() {
        this.component = document.createElement("DIV");
        const $popUp = this.component;

        $popUp.classList.add("popUp");

        $popUp.innerHTML = `
            <div class="popUp-body scrollbar-skyBlue">
                <div class="x-button"></div>
            </div>
        `;

        $popUp.querySelector(".popUp-body").style.maxWidth = this.maxWidth + "px";

        //añadir boton de cerrar
        if (this.closeButton === true) {
            const $closeButton = $popUp.querySelector(".x-button");
            $closeButton.style = "block";
            $closeButton.addEventListener("click", e => {

                this.close();
                if (this.reject != undefined) this.reject(); // rechazar promesa
            });
        }

        if (this.closeWithBackgroundClick !== true) {

            $popUp.addEventListener("click", e => {

                e.stopPropagation();
                if (e.target === e.currentTarget) {
                    this.close();
                    if (this.reject != undefined) this.reject(); // rechazar promesa
                }
            })
        }

    }

    open() {
        if (this.opened === false) {
            this.opened = true;

            return new Promise((resolve, reject) => {

                this.resolve = resolve;
                this.reject = reject;

                document.querySelector("body").appendChild(this.component);

            })
        }
    }

    close() {

        return new Promise((resolve, reject) => {
            if (!this.component) reject();


            this.opened = false;
            $(this.component).fadeOut(300, () => {
                this.component.remove();
                resolve();
            });

        });


    }

}