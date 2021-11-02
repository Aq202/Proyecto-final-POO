import { HomePage } from "./HomePage.js";
import { ProductRegistrationPage } from "./ProductRegistrationPage.js";
import { LoginPage } from "./LoginPage.js";
import { RegistrationPage } from "./RegistrationPage.js";
import { User } from "../scripts/User.js";


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

        this.removeCompleteWindow();

        if(hash === "" || hash.includes("/home")){ //home
            this.component.appendChild(new HomePage().component)
        }
        else if (hash.includes("/registerProduct")){
            this.component.appendChild(new ProductRegistrationPage().component);
        }
        else if (hash.includes("/login")){
            this.component.appendChild(new LoginPage().component)
            this.setCompleteWindow();
        }
        else if (hash.includes("/logout")){
            User.logout();
            location.hash = "/login";
        }
        else if (hash.includes("/registration")){
            this.component.appendChild(new RegistrationPage().component)
            this.setCompleteWindow();
        }
        else{
            location.hash = "";
        }
    }

    setCompleteWindow(){
        const $rootDiv = document.getElementById("root");

        if($rootDiv){
            $rootDiv.classList.add("completeWindow")
        }
    }

    removeCompleteWindow(){
        const $rootDiv = document.getElementById("root");

        if($rootDiv){
            $rootDiv.classList.remove("completeWindow")
        }
    }
}