import { HomePage } from "./HomePage.js";
import { ProductRegistrationPage } from "./ProductRegistrationPage.js";
import { LoginPage } from "./LoginPage.js";
import { Session } from "../scripts/Session.js";
import { ProductPage } from "./ProductPage.js";
import { Product } from "../scripts/Product.js";
import { PageNotFound } from "./PageNotFound.js";
import { LoadingView } from "./LoadingView.js";
import { RegistrationPage } from "./RegistrationPage.js";
import { User } from "../scripts/User.js";


export class PageRouter {

    constructor() {

        this.initComponent();

    }


    initComponent() {

        this.component = document.createElement("div")
        this.component.id = "pageRouter"

        
        this.router();

        //cuando se modifica el hash
        window.addEventListener("hashchange", this.router.bind(this));

    }

    async router() {

        this.addLoadingView();

        //Intentar restaurar sesion
        if (!Session.userInSession) await Session.restoreSessionByToken();
        Session.updateSessionState();

        const hash = location.hash;

        if (hash === "" || hash === "#/" || hash.includes("/home")) { //home
            
            this.renderView(new HomePage().component)
        }
        else if (hash.includes("/registerProduct")) {
            
            this.renderView(new ProductRegistrationPage().component);
        }
        else if (hash.includes("/login")) {

            let back = (this.getParameters(hash)?.back != undefined) ? true : false;
            this.renderView(new LoginPage({ back }).component, true);
        }
        else if (hash.includes("/logout")) {
            Session.logout();
            location.hash = "/login";
        }
        else if (hash.includes("/product")) {

            let productId = this.getParameters(hash)?.productId;

            try {
                let productData = await Product.getProductData(productId);

                    
                    this.renderView(new ProductPage(productData).component);
    
            } catch (ex) {
                //producto no encontrada
                this.addNotFoundPage();
            }
        }
        else if (hash.includes("/registration")){
            this.renderView(new RegistrationPage().component, true);
        }
        else{
            location.hash = "";
        }
    }

    renderView(view, completeWindow) {

        completeWindow ||= false;

        if (!view) return;

        if(completeWindow === true) this.setCompleteWindow();
        else this.removeCompleteWindow();

        this.clearRouter();
        this.component.appendChild(view);

    }

    setCompleteWindow() {
        const $rootDiv = document.getElementById("root");

        if ($rootDiv) {
            $rootDiv.classList.add("completeWindow")
        }
    }

    removeCompleteWindow() {
        const $rootDiv = document.getElementById("root");

        if ($rootDiv) {
            $rootDiv.classList.remove("completeWindow")
        }
    }

    clearRouter() {
        this.component.innerHTML = "";
    }

    addNotFoundPage() {
        this.renderView(new PageNotFound().component);
    }

    addLoadingView(){
        this.renderView(new LoadingView().component, true);
    }

    getParameters(hash) {

        let index = hash.indexOf("?") + 1;
        let parameters = {};

        if (index >= 0) {

            let parametersString = hash.substring(index, hash.length);
            let pairOfParameters = parametersString.split("&");

            for (let pair of pairOfParameters) {

                let param = pair.split("=");
                if (param.length === 2) {
                    parameters[param[0]] = param[1];
                }
            }
        }

        return parameters;
    }
}