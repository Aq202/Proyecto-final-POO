import { User } from "../scripts/User.js";

export class LoginPage{
    constructor(){
        this.initComponent();
    }
    initComponent(){
        this.component = document.createElement("div");
        const $loginPage = this.component;

        this.component.setAttribute("id", "loginPage");

        this.component.innerHTML = `
        <div class="loginContainer">
            <img class="logo" src="images/icons/logo.jpg" alt="Logo Proyecto">

            <h1>Inicio de sesión</h1>
            <form>
                <!--Nombre de usuario-->
                <label for = "username">Nombre de usuario</label>
                <input id="username-input" type="text" placeholder="Ingresar nombre de usuario">

                <!--Contraseña-->
                <label for = "password-input">Contraseña</label>
                <input id="password-input" type="text" placeholder="Ingresar contraseña">

                <input type="submit" id="btn-login" value="Iniciar sesión">

            </form>

            <div class = "error"></div>

            <a href ="#">¿Aún no tienes una cuenta? Regístrate ahora</a>
        </div>
            `;

            $loginPage.querySelector("#btn-login").addEventListener("click", e => {
                this.login();
            })
    }

    async login() {

        const $inputUserName = this.component.querySelector("#username-input");
        const $inputPassword = this.component.querySelector("#password-input");

        if(!$inputUserName || !$inputPassword) return;

        const userName = $inputUserName.value;
        const password = $inputPassword.value;


        try {
            const hola = await User.login({
                user: userName,
                email: userName,
                password: password
            })

            console.log(hola)

            //exitoso, redirigir a la página home
            location.href = "/";
        } catch (err) {
            this.showError();
        }

    }


    showError() {

    }
}