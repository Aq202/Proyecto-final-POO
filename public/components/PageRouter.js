import { HomePage } from "./HomePage.js";
import { LoginPage } from "./LoginPage.js";


export class PageRouter{

    constructor(){

        this.initComponent();

    }


    initComponent(){

        this.component = document.createElement("div")
        this.component.id = "pageRouter"
   
        this.renderView();

        //cuando se modifica el hash
        window.addEventListener("hashchange", this.renderView.bind(this));

    }

    renderView(){

        const hash = location.hash;
        
        //vaciar router container
        this.component.innerHTML = "";

        if(hash === "" || hash.includes("/home")){ //home
            this.component.appendChild(new HomePage().component)
        }
        else if (hash.includes("/login")){
            this.component.appendChild(new LoginPage().component)
        }
        else{
            location.hash = "";
        }
    }
}