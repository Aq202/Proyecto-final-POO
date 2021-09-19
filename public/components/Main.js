
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
        const pageWrapper = new PageRouter()
        
        $root.appendChild(header.init())
        $root.appendChild(navBar.init());
        $root.appendChild(pageWrapper.element)
        
        
        const loadedEvent = new CustomEvent("appLoaded");
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