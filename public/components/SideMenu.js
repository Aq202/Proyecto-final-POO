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
                <h2 class="title" > 
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

        //eventos cerrar menu
        this.component.querySelectorAll("a").forEach(elem =>{
            elem.addEventListener("click", e => this.close());
        });

        window.addEventListener("hashchange", e => this.close());

    }

    toggle(){
        this.component.classList.remove("instant");
        this.component.classList.toggle("opened");
    }

    close(){
        this.component.classList.add("instant");
        this.component.classList.remove("opened");
    }
}