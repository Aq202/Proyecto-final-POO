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
            <div class="popUp-body scrollbar-gray">
                <div class="x-button"></div>
            </div>
        `;

        $popUp.querySelector(".popUp-body").style.maxWidth = this.maxWidth + "px";

        //añadir boton de cerrar
        if (this.closeButton === true) {
            const $closeButton = $popUp.querySelector(".x-button");
            $closeButton.style.display = "block";
            $closeButton.addEventListener("click", e => {

                this.close();
                if (this.reject != undefined) this.reject(); // rechazar promesa
            });
        }

        //evento de cerrar al dar click al fondo
        if (this.closeWithBackgroundClick === true) {

            $popUp.addEventListener("click", e => {

                e.stopPropagation();
                if (e.target === e.currentTarget) {
                    this.close();
                    if (this.reject != undefined) this.reject(); // rechazar promesa
                }
            })
        }

        const hashChange = () => {
            window.removeEventListener("hashchange", hashChange);

            if(this.opened === true){
                this.fastClose();
                if(this.reject !== undefined) this.reject();
            }
        }

        window.addEventListener("hashchange", hashChange);

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

    fastClose(){
        if (!this.component) return;
        this.opened = false;
        this.component.remove();
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