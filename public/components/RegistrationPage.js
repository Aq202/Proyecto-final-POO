import { User } from "../scripts/User.js";

export class RegistrationPage{
    constructor(){

        this.initComponent();
        this.name = "";
        this.usename = "";
        this.email = "";
        this.dpi = 0;
        this.password = "";
    }
    initComponent(){
        this.component = document.createElement("div");
        const $registrationPage = this.component;

        this.component.setAttribute("id", "registrationPage");

        this.component.innerHTML = `
        <div class="container">
            <div class="title">Registro</div>
            <form action="#">
                <div class="user-details">
                    <div class="input-box">
                        <span class="details">Nombre completo</span>
                        <input id="name-input" type="text" placeholder="Ingrese su nombre completo" required>
                    </div>
                    <div class="input-box">
                        <span class="details">Nombre de usuario</span>
                        <input id="username-input" type="text" placeholder="Ingrese su nombre de usuario" required>
                    </div>
                    <div class="input-box">
                        <span class="details">Correo electrónico</span>
                        <input id="email-input" type="text" placeholder="Ingrese su correo electrónico" required>
                    </div>
                    <div class="input-box">
                        <span class="details">DPI</span>
                        <input id="dpi-input" type="text" placeholder="Ingrese su número de DPI" required>
                    </div>
                    <div class="input-box">
                        <span class="details">Contraseña</span>
                        <input id="password-input" type="text" placeholder="Ingrese su contraseña" required>
                    </div>
                    <div class="input-box">
                        <span class="details">Confirmar contraseña</span>
                        <input id="confirmPass-input" type="text" placeholder="Ingrese su contraseña nuevamente" required>
                    </div>
                </div>
                <div class="sex-details">
                    <input type="radio" name="sex" id="dot-1">
                    <input type="radio" name="sex" id="dot-2">
                    <span class="gender-title">Sexo</span>
                    <div class="category">
                        <label for="dot-1">
                            <span class="dot one"></span>
                            <span class="gender">Masculino</span>
                        </label>
                        <label for="dot-2">
                            <span class="dot two"></span>
                            <span class="gender">Femenino</span>
                        </label>
                    </div>
                </div>
                <div class="button">
                    <input type="submit" value="Registrarse">
                </div>
                <p class="errorMessage"></p>
            </form>
        </div>
        `;
    }

    async signUp(){
        const $inputName = this.querySelector("#name-input");
        const $inputUserName = this.querySelector("username-input");
        const $inputEmail = this.querySelector("email-input");
        const $inputPassword = this.querySelector("password-input");
        const $inputConfirmPass = this.querySelector("confirmPass-input");
    }

    showError(errorMessage) {

        if (!this.component || errorMessage === undefined) return;

        const $errorElement = this.component.querySelector(".errorMessage");
        if (!$errorElement) return;

        $errorElement.style.display = "block";
        $errorElement.innerText = errorMessage.trim();
    }

    hideError(){
        const $errorMessage = this.component.querySelector(".error");
        if(!$errorMessage) return;
        
        $errorMessage.style.display = "none";
    }


}
