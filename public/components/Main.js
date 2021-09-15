import { Header } from "./Header.js";
import { NavBar } from "./NavBar.js";


export class Main{

    constructor(){

        const $main = document.getElementById("main")

        if(!$main)return;
        
        const userData = this.login();

        const header = new Header();
        const navBar = new NavBar(userData);
        

        $main.appendChild(header.init());
        $main.appendChild(navBar.init());
        


        
    }

    login(){

        return{
            id: "sdfsadffas",
            name: "Diego Morales",
            profileImage: "images/profileImages/1.jpg"
        }
    }




}