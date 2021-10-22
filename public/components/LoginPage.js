import { User } from "../scripts/User.js";

export class LoginPage{
    constructor(){

        if(User.userInSession === true) location.hash = "/";

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
                <input id="username-input" type="text" placeholder="Ingresar nombre de usuario" autocomplete="off">

                <!--Contraseña-->
                <label for = "password-input">Contraseña</label>
                <input id="password-input" type="password" placeholder="Ingresar contraseña">

                <input type="submit" id="btn-login" value="Iniciar sesión">

            </form>

            <div class = "error">Usuario y/o contraseña incorrectos</div>

            <a href ="#">¿Aún no tienes una cuenta? Regístrate ahora</a>
        </div>
            `;

            $loginPage.querySelector("#btn-login").addEventListener("click", e => {
                e.preventDefault();
                this.login();
            })
    }

    async login() {

        this.hideError();

        const $inputUserName = this.component.querySelector("#username-input");
        const $inputPassword = this.component.querySelector("#password-input");

        if(!$inputUserName || !$inputPassword) return;

        const userName = $inputUserName.value;
        const password = $inputPassword.value;


        if(userName.trim() !== "" && password.trim() != ""){
            try {
                await User.login({
                    user: userName,
                    email: userName,
                    password: password
                })
    
    
                //exitoso, redirigir a la página home
                location.hash = "/";
           
            } catch (err) {
                this.showError("Usuario o constraseña incorrecta.");
            }
        }
        else{
            this.showError("Usuario o contraseña incorrecta.");
        }

        

    }

    showError(error) {

        const $errorMessage = this.component.querySelector(".error");
        if(!$errorMessage || error == undefined) return;
        
        $errorMessage.style.display = "block";
        $errorMessage.innerText = error;
    }

    hideError(){
        const $errorMessage = this.component.querySelector(".error");
        if(!$errorMessage) return;
        
        $errorMessage.style.display = "none";
    }


}