import { HomePage } from "./HomePage.js";
import { ProductRegistrationPage } from "./ProductRegistrationPage.js";
import { LoginPage } from "./LoginPage.js";
import { Session } from "../scripts/Session.js";
import { ProductPage } from "./ProductPage.js";
import { Product } from "../scripts/Product.js";


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

    async renderView(){

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
            Session.logout();
            location.hash = "/login";
        }
        else if (hash.includes("/product")){

            let productId = this.getParameters(hash)?.productId;
            let productData = await Product.getProductData(productId);

            this.component.appendChild(new ProductPage(productData).component)
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

    getParameters(hash){

        let index = hash.indexOf("?") + 1;
        let parameters = {};

        if(index >= 0){

            let parametersString = hash.substring(index, hash.length);
            let pairOfParameters = parametersString.split("&");

            for(let pair of pairOfParameters){

                let param = pair.split("=");
                if(param.length === 2){
                    parameters[param[0]] = param[1];
                }
            }
        }

        return parameters;
    }
}