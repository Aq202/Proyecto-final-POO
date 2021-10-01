import { DOMFunctions } from "../helpers/DOMFunctions.js";
import { NotificationTray } from "./NotificationTray.js";

export class NavBar {

    constructor({ id, name, profileImage }) {

        this._userId = id;
        this._userName = name;
        this._userImageUrl = profileImage;

    }

    init() {

        this.element = document.createElement("nav");
        const $nav = this.element;

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

        const $notificationsOption = this.element.querySelector("#notificationsOption");
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

        const $elements = this.element.querySelectorAll("#searchOption, #x-search");

        if (!$elements) return;

        $elements.forEach(elem => {
            elem.addEventListener("click", e => {
                this.element.classList.toggle("searching")
            })
        })

    }



    addEvents() {

        const $profileImage = this.element.querySelector("#userImage")

        $profileImage.addEventListener("click", e => {

            const obj = {
                user: prompt("Usuario:"),
                password: prompt("contraseña")
            }
            fetch("/login", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(r => r.json())
                .then(result => {

                    if (!result.token) return;

                    localStorage.setItem("token", result.token)
                    localStorage.setItem("userData", JSON.stringify(obj))
                }).catch(err => console.error("Error en login:: ", err))
        })
    }
}