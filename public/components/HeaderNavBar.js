

export class HeaderNavBar{

    init(){
        const $header = document.createElement("header");
        $header.setAttribute("id", "header-navBar")
        $header.innerHTML = `
        <ul>
            <li class="headerOption"><a href="">Productos</a></li>
            <li class="headerOption"><a href="">Tienda</a></li>
            <li class="headerOption"><a href="">Beneficiarios</a></li>
            <li class="headerOption"><a href="">Más</a></li>
        </ul>
        `

        return $header;
    }
}