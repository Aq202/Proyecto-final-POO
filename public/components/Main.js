import { Session } from "../scripts/Session.js";

import { Footer } from "./Footer.js";
import { HeaderNavBar } from "./HeaderNavBar.js";
import { NavBar } from "./NavBar.js";
import { PageRouter } from "./PageRouter.js";



export class Main{

    constructor(){

        const $root = document.querySelector("#root")

        if(!$root)return;
        
        const userData = this.login();

        const header = new HeaderNavBar();
        const navBar = new NavBar(userData);
        const pageRouter = new PageRouter();
        const footer = new Footer();
        
        $root.appendChild(header.component);
        $root.appendChild(navBar.component);
        $root.appendChild(pageRouter.component);
        $root.appendChild(footer.component);
        
        
        const loadedEvent = new CustomEvent(" ");
        document.dispatchEvent(loadedEvent);

        
    }

    login(){

        return{
            id: "sdfsadffas",
            name: "Diego Morales",
            profileImage: "images/profileImages/1.jpg"
        }
    }




}