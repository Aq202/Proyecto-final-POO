import { DOMFunctions } from "../helpers/DOMFunctions.js";
import { User } from "../scripts/User.js";
import { NotificationTray } from "./NotificationTray.js";

export class NavBar {

    constructor({ id, name, profileImage }) {

        this._userId = id;
        this._userName = name;
        this._userImageUrl = profileImage;

        this.initComponent();
    }

    initComponent() {

        this.component = document.createElement("nav");
        const $nav = this.component;

        $nav.setAttribute("id", "navBar");

        //$nav.classList.add("searching")

        $nav.innerHTML = `
        <div class="navigationIcons">
            <button id="menuOption" class="navigationIcons"></button>
        </div>
        <div id='search'>
            <div id='search-input-containor'>
                <button id="x-search"></button>
                <input type='text' id='input-search' placeholder='Buscar...'>
                <button id="lupa-search"></button>
            </div>

            <div id="search-suggestions"> </div>
        </div>

        <div id="navigationIconsContainer">


            <div class="navigationIcons">
                <button id="searchOption"></button>
            </div>
            
            <div class="navigationIcons">
                <button id="donationsOption"></button>
            </div>
            <div class="navigationIcons">
                <button id="chatOption"></button>
            </div>
            <div id="notification-section" class="navigationIcons">
                <button id="notificationsOption"></button>
            </div>
            <div class="navigationIcons">
                <img src="${this._userImageUrl}" alt="${this._userName}" }" id="userImage">
            </div>
            
        </div>
              
        `

        //agregar paneles de notificaciones
        const $notificationSection = $nav.querySelector("#notification-section")
        const notificationTray = new NotificationTray();
        if ($notificationSection) $notificationSection.appendChild(notificationTray.component);



        //add events
        this.notificationsOptionEvent(notificationTray);
        this.addDynamicHiddingNotifications(notificationTray);
        this.searchOptionEvent();



        this.addEvents()

        return $nav;
    }

    notificationsOptionEvent(notificationTray) {

        const $notificationsOption = this.component.querySelector("#notificationsOption");
        if (!$notificationsOption) return;

        $notificationsOption.addEventListener("click", e => {
            $(notificationTray.component).stop();
            $(notificationTray.component).slideToggle(500);

            notificationTray.initializeContent();
        })
    }

    addDynamicHiddingNotifications(notificationTray) {

        document.addEventListener("click", e => {
            const $element = e.target;

            //si no se hizo click en las notificaciones
            if ($element.closest("#notification-section") === null) {

                $(notificationTray.component).stop();
                $(notificationTray.component).hide();
            }

        })
    }

    searchOptionEvent() {

        const $elements = this.component.querySelectorAll("#searchOption, #x-search");

        if (!$elements) return;

        $elements.forEach(elem => {
            elem.addEventListener("click", e => {
                this.component.classList.toggle("searching")
            })
        })

    }



    addEvents() {

        const $profileImage = this.component.querySelector("#userImage")

        $profileImage.addEventListener("click", async e => {

            let result = await User.getUser({
                user:prompt("Usuario:"),
                password:prompt("Contraseña")
            })

            console.log(result)
        })


        this.component.querySelector("#chatOption").addEventListener("click", async e =>{


            let result = await User.createNewUser({
                dpi:45125426,
                username:prompt("Ingresa tu usuario: "),
                age:18,
                email:"diego@gmail.com",
                password:prompt("Contraseña: "),
                name:"Diego",
                lastname:"Morales",
                direction:"Villa Nueva",
                sex:"M",
                birtday:new Date()
            })


        })

    }
}