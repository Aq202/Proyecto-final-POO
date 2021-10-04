

export class HeaderNavBar{

    constructor(){
        this.initComponent()
    }

    initComponent(){

        this.component = document.createElement("header");
        this.component.setAttribute("id", "header-navBar")
        this.component.innerHTML = `
        <ul>
            <li class="headerOption"><a href="">Productos</a></li>
            <li class="headerOption"><a href="">Tienda</a></li>
            <li class="headerOption"><a href="">Beneficiarios</a></li>
            <li class="headerOption"><a href="">Más</a></li>
        </ul>
        `

        return this.component;
    }
}