import { Banner } from "./banner.js"

export class PageRouter{

    constructor(){

        this.initComponent();

    }


    initComponent(){

        this.element = document.createElement("div")
        this.element.id = "pageRouter"

        this.element.appendChild(new Banner().element)

        let hola = document.createElement("div")
        hola.style.height = "1000px";
        hola.style.width = "50px";
        hola.style.backgroundColor = "red";

        //this.element.style.overflow = "auto"

        this.element.appendChild(hola)


    }
}