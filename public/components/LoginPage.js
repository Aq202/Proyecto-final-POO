export class LoginPage{
    constructor(){
        this.initComponent();
    }
    initComponent(){
        this.component = document.createElement("div");

        this.component.setAttribute("id", "loginPage");

        this.component.innerHTML = `
        <div class="loginContainer">
            <img class="logo" src="images/icons/logo.jpg" alt="Logo Proyecto">

            <h1>Inicio de sesión</h1>
            <form>
                <!--Nombre de usuario-->
                <label for = "username">Nombre de usuario</label>
                <input type="text" placeholder="Ingresar nombre de usuario">

                <!--Contraseña-->
                <label for = "password">Contraseña</label>
                <input type="text" placeholder="Ingresar contraseña">

                <input type="submit" value="Iniciar sesión">

            </form>

            <a href ="#">¿Aún no tienes una cuenta? Regístrate ahora</a>
        </div>
            `;
    }
}