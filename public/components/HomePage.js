import { Filter } from "../scripts/Filter.js";
import { Product } from "../scripts/Product.js";
import { Session } from "../scripts/Session.js";
import { Banner } from "./Banner.js";
import { DonationsContainer } from "./DonationsContainer.js";
import { FilterSection } from "./FilterSection.js";

export class HomePage {

    constructor() {

        this.initComponent();
    }

    initComponent() {

        this.component = document.createElement("div");

        this.component.setAttribute("id", "homePage");
        this.component.classList.add("pageContainer")

        //crear estructura de la página

        //banner
        this.component.appendChild(new Banner().component)


        //crear encabezado
        const $separator = document.createElement("div");
        $separator.classList.add("homeHeader");

        let welcomeMessage = "Bienvenido";
        let secondMessage = "Estamos felices de tenerte con nosotros."

        if(Session.userInSession === true){
            welcomeMessage = `Hola, ${Session.name}`;
            secondMessage = "Estamos felices de tenerte de vuelta."
            
        }

        $separator.innerHTML = `
        <h2>${welcomeMessage}</h2>
        <h3>${secondMessage}</h3>
        `;


        this.component.appendChild($separator);

        //seccion de filtros
        this.component.appendChild(new FilterSection().component);

        //Contenedor de donaciones
        this.donationsContainer = new DonationsContainer();
        this.component.appendChild(this.donationsContainer.component);
        this.fillDonationContainer();
        


    }

    async fillDonationContainer(max){

        max ||= 10;

        const {department, municipality, search, category} = Filter.filters;

        this.donationsContainer.addLoadingStyle();

        const productList = await Product.getProducts({department, municipality, search, category, max});

        this.donationsContainer.removeLoadingStyle();

        this.donationsContainer.addContent(...productList);




    }

}