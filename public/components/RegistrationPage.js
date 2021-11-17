import { User } from "../scripts/User.js";
import { ImagePicker } from "./ImagePicker.js";

export class RegistrationPage{
    constructor(){

        this.initComponent();
        this.name = "";
        this.lastname = "";
        this.age = 0;
        this.sex = "";
        this.birthday = "";
        this.username = "";
        this.email = "";
        this.dpi = 0;
        this.password = "";
        this.confirmPass = "";
        this.address = "";
        this.profilePic = null;
        this.imageFiles = [];
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
                    <span class="details">Nombre</span>
                    <input id="name-input" type="text" placeholder="Ingrese su primer nombre" required>
                    </div>
                    <div class="input-box">
                       <span class="details">Apellido</span>
                        <input id="lastname-input" type="text" placeholder="Ingrese su apellido" required>
                    </div>
                    <div class="input-box">
                        <span class="details">Fecha de nacimiento</span>
                        <input id="date-input" type="date" placeholder="Ingrese su fecha de nacimiento" required>
                    </div>
                    <div class="input-box">
                        <span class="details">DPI</span>
                        <input id="dpi-input" type="text" placeholder="Ingrese su número de DPI" required>
                    </div>
                    <div class="input-box-address">
                        <span class="details">Dirección</span>
                        <input id="address-input" type="text" placeholder="Ingrese su dirección" required>
                    </div>
                    <div class="input-box">
                        <span class="details">Correo electrónico</span>
                        <input id="email-input" type="text" placeholder="Ingrese su correo electrónico" required>
                    </div>
                    <div class="input-box">
                        <span class="details">Nombre de usuario</span>
                        <input id="username-input" type="text" placeholder="Ingrese un nombre de usuario" required>
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
                <div class="imagesSection">
                    <span class="details">Selecciona una imagen para tu fotografía de perfil</span>
                    <div class="profilePicPicker"></div>
                    <span class="details">Sube una fotografía de cada lado de tu DPI</span>
                    <div class="dpiPicker"></div>
                </div>
                <div class="button">
                    <input type="submit" id= "sign-up-button" value="Registrarse">
                </div>
                <p class="errorMessage"></p>
            </form>
        </div>
        `;

        //Añadir imagePickers para foto de perfil y DPI
        const $profilePicSection = $registrationPage.querySelector(".profilePicPicker");
        const $dpiSection = $registrationPage.querySelector(".dpiPicker");

        const imagePickerDpi = new ImagePicker();
        const imagePickerProfilePic = new ImagePicker();

        this.dpiImageInput = imagePickerDpi.component.querySelector(".inputFile");
        this.profilePicInput = imagePickerProfilePic.component.querySelector(".inputFile");
        
        //evento al cambiar los archivos seleccionados del selector de imagen de perfil
        imagePickerProfilePic.component.addEventListener("changeFile", e => {
            const files = e.detail;
            if (!files) return;

            let imageFiles = imagePickerProfilePic.files;
            this.profilePic = imageFiles[0];
        })

        //evento al cambiar los archivos seleccionados del selector de imagen de dpi
        imagePickerDpi.component.addEventListener("changeFile", e=> {
            const files = e.detail;
            if (!files) return;

            let imageFiles = imagePickerDpi.files;
            this.dpiPics = imageFiles;
        })

        $profilePicSection.appendChild(imagePickerProfilePic.component);
        $dpiSection.appendChild(imagePickerDpi.component);

        //Evento enviar forumlario
        this.component.querySelector("#sign-up-button").addEventListener("click", e => this.sendForm());
    }

    //Seleccionar datos

    selectFirstName(){ //Primer nombre
        const $inputName = this.component.querySelector("#name-input");
        if ($inputName === undefined) return;
        this.name = $inputName.value.trim();
    }

    selectLastName(){ //Apellido
        const $inputLastName = this.component.querySelector("#lastname-input");
        if ($inputLastName === undefined) return;
        this.lastname = $inputLastName.value.trim();
        
    }

    selectBirthday(){ //Fecha de nacimiento
        const $inputBirthday = this.component.querySelector("#date-input");
        if ($inputBirthday === undefined) return;
        this.birthday = $inputBirthday.value;
        /*let today = new Date();
        let age = today.getFullYear() - this.birthday.getFullYear();
        let month = today.getMonth() - this.birthday.getMonth();
        if (month < 0 || (month === 0 & today.getDate() < this.birthday.getDate())){
            age--;
        }
        this.age = age;*/
    }

    selectDpi(){
        const $inputDpi = this.component.querySelector("#dpi-input");
        if ($inputDpi === undefined) return;
        this.dpi = $inputDpi;
    }

    selectAddress(){
        const $inputAddress = this.component.querySelector("#address-input");
        if ($inputAddress === undefined) return;
        this.address = $inputAddress;
    }

    selectEmail(){
        const $inputEmail = this.component.querySelector("#email-input");
        if ($inputEmail === undefined) return;
        this.email = $inputEmail;
    }

    selectUsername(){
        const $inputUserName = this.component.querySelector("#username-input");
         if ($inputUserName === undefined) return;
        this.username = $inputUserName;
    }

    selectPassword(){
        const $inputPassword = this.component.querySelector("#password-input");
        if ($inputPassword === undefined) return;
        this.password = $inputPassword;
    }

    selectConfirmPass(){
        const $inputConfirmPass = this.component.querySelector("#confirmPass-input");
        if ($inputConfirmPass === undefined) return;
        this.confirmPass = $inputConfirmPass;
    }

    selectSex(){
        if(!this.component.getElementById("#dot-1").checked && !this.component.getElementById("#dot-2").checked) return;
        if (this.component.getElementById("#dot-1").checked) this.sex = "Male";
        if (this.component.getElementById("#dot-2").checked) this.sex = "Female";
    }


    //Validaciones
    validateData(){

        if (!this.component) return false;

        this.selectAddress();
        this.selectBirthday();
        this.selectConfirmPass();
        this.selectDpi();
        this.selectEmail();
        this.selectFirstName();
        this.selectLastName();
        this.selectPassword();
        this.selectSex();
        this.selectUsername();
        
        //Validar nombre
        if (this.name === ""){
            this.showError("El campo de nombre es obligatorio");
            return false;
        }

        //Validar apellido
        if (this.lastname === ""){
            this.showError("El campo de apellido es obligatorio");
            return false;
        }

        //Validar fecha de nacimiento
        if (this.birthday === ""){
            this.showError("El campo de fecha de nacimiento es obligatorio");
            return false;
        }

        if (this.dpi === 0){
            this.showError("El campo de DPI es obligatorio");
            return false;
        }

        if (this.address === ""){
            this.showError("El campo de fecha de dirección es obligatorio");
            return false;
        }

        if (this.email === ""){
            this.showError("El campo de correo electrónico es obligatorio");
            return false;
        }

        if (this.username === ""){
            this.showError("El campo de correo electrónico es obligatorio");
            return false;
        }

        if (this.password === ""){
            this.showError("El campo de contraseña es obligatorio");
            return false;
        }

        if (this.confirmPass === ""){
            this.showError("Debe confirmar su contraseña");
            return false;
        }

        if (this.sex === ""){
            this.showError("Por favor, seleccione un sexo");
            return false;
        }

        if(this.password != this.confirmPass){
            this.showError("La contraseñas ingresadas no coinciden");
            return false;
        }

        //Validar imagenes

        if(this.profilePic === null){ //De perfil
            this.showError("Por favor, ingrese una fotografía de perfil");
            return false;
        }

        if(this.dpiPics.length < 2){ //Del DPI
            this.showError("Por favor, ingrese una fotografía de cada lado de su DPI");
            return false;
        }

        //Ningún error, éxito
        this.showError("");
        return true;
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

    sendForm(){
        if (this.validateData() === true){
            this.imageFiles[0] = this.profilePic;
            this.imageFiles[1] = this.dpiPics[0];
            this.imageFiles[2] = this.dpiPics[1];
            let user = new User(this.username, this.name + " " + this.lastname, this.profilePic)
            user.crateNewUser(this.dpi, this.username, this.age, this.email, this.password, this.address, this.name, this.lastname, this.address, this.sex, this.birthday, this.imageFiles);
        }
    }

}
