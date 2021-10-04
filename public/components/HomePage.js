import { Banner } from "./Banner.js";
import { DonationsContainer } from "./DonationsContainer.js";

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
        $separator.innerHTML = `
        <h2>Hola, Diego Morales</h2>
        <h3>Estamos felices de tenerte de vuelta.</h3>
        `;


        this.component.appendChild($separator);

        //Contenedor de donaicones
        this.component.appendChild(new DonationsContainer().component)



    }

}