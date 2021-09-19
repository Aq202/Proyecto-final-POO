import { Banner } from "./banner.js"

export class PageRouter{

    constructor(){

        this.initComponent();

    }


    initComponent(){

        this.element = document.createElement("div")
        this.id = "pageRouter"

        this.element.appendChild(new Banner().element)


    }
}