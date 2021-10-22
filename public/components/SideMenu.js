export class SideMenu{

    constructor(){
        this.initComponent();
    }

    initComponent(){


        this.component = document.createElement("div");
        const $sideMenu = this.component;

        $sideMenu.id = "side-menu";
        $sideMenu.classList.add("side-nav");


        $sideMenu.innerHTML = `

        <ul>

            <li class="">
                <h2 id="title" > 
                    Menú
                </h2>
            </li>
                   
            <li class="">
                <img src="../images/icons/home.svg" alt = "home">
                <a href="#/">Inicio</a>
            </li>
       
            <li class="">
                <img src="../images/icons/profileLogo.svg" alt = "profile">
                <a href="#">Mi perfil</a>
            </li>
        
            <li class="">
                <img src="../images/icons/settingsLogo.svg" alt = "settings">
                <a href="#">Configuración</a>
            </li>

            <li class="">
            <img src="../images/icons/productLogo.svg" alt = "settings">
            <a href="#/registerProduct">Registrar producto</a>

        </li>
        </ul>
        <div id="logout-button">
            <img src="../images/icons/logOut.svg" alt = "settings">
            <a href="#/logout">Cerrar sesión</a>
        </div>   
        `;

    }
}