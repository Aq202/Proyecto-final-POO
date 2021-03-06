
import { SocketClient } from "../scripts/SocketClient.js";
import { Footer } from "./Footer.js";
import { HeaderNavBar } from "./HeaderNavBar.js";
import { NavBar } from "./NavBar.js";
import { PageRouter } from "./PageRouter.js";



export class Main{

    constructor(){

        const $root = document.querySelector("#root")

        if(!$root)return;
        

        const header = new HeaderNavBar();
        const navBar = new NavBar();
        const pageRouter = new PageRouter();
        const footer = new Footer();
        
        $root.appendChild(header.component);
        $root.appendChild(navBar.component);
        $root.appendChild(pageRouter.component);
        $root.appendChild(footer.component);
    

        //inciar cliente de socket
        SocketClient.initSocket();

        
    }






}