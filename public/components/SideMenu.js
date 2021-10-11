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
                <a href="#">Inicio</a>
            </li>
       
            <li class="">
                <a href="#">Mi perfil</a>
            </li>
        
            <li class="">
                <a href="#">Configuración</a>
            </li>
        </ul>   
        `;

    }
}