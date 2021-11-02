import { User } from "../scripts/User.js";

export class RegistrationPage{
    constructor(){

        this.initComponent();
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
                        <input type="text" placeholder="Ingrese su nombre completo" required>
                    </div>
                    <div class="input-box">
                        <span class="details">Nombre de usuario</span>
                        <input type="text" placeholder="Ingrese su nombre de usuario" required>
                    </div>
                    <div class="input-box">
                        <span class="details">Correo electrónico</span>
                        <input type="text" placeholder="Ingrese su correo electrónico" required>
                    </div>
                    <div class="input-box">
                        <span class="details">DPI</span>
                        <input type="text" placeholder="Ingrese su número de DPI" required>
                    </div>
                    <div class="input-box">
                        <span class="details">Contraseña</span>
                        <input type="text" placeholder="Ingrese su contraseña" required>
                    </div>
                    <div class="input-box">
                        <span class="details">Confirmar contraseña</span>
                        <input type="text" placeholder="Ingrese su contraseña nuevamente" required>
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
            </form>
        </div>
        `;
    }
}
