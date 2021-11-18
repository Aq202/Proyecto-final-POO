import { Filter } from "../scripts/Filter.js";
import { Session } from "../scripts/Session.js";
import { NotificationTray } from "./NotificationTray.js";
import { SideMenu } from "./SideMenu.js";

export class NavBar {

    constructor() {

        this._userId = Session.id;
        this._userName = Session.name;
        this._userImageUrl = Session?.profileImage || "images/profileImages/default.svg";

        this.initComponent();
    }

    initComponent() {

        this.component = document.createElement("nav");
        const $nav = this.component;

        $nav.setAttribute("id", "navBar");

        $nav.innerHTML = `
            <div class="navContainer">
                <div class="navigationIcons menuIcon">
                    <button id="menuOption"></button>
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
             
                    <button class="sessionButton" id="signInButton">Regístrate</button>
                    <button class="sessionButton" id="logInButton">Ingresar</button>
                </div>

            </div>
              
        `;

        //agregar estilo para usuario logeado
        this.changeLoggedStyle();
        document.addEventListener("sessionStateChanged", this.changeLoggedStyle.bind(this));


        //agregar paneles de notificaciones
        const $notificationSection = $nav.querySelector("#notification-section")
        const notificationTray = new NotificationTray();
        if ($notificationSection) $notificationSection.appendChild(notificationTray.component);


        //agregar side menu
        const sideMenu = new SideMenu();
        $nav.querySelector(".navContainer").appendChild(sideMenu.component);


        //add events
        this.notificationsOptionEvent(notificationTray);
        this.sessionButtonEvents();
        this.addDynamicHiddingNotifications(notificationTray);
        this.searchVisibilityEvent();
        this.sideMenuOptionEvent(sideMenu);

        //eventos de búsqueda
        $nav.querySelector("#lupa-search").addEventListener("click", e => this.newSearchEvent(e));
        $nav.querySelector("#input-search").addEventListener("keyup", e => {

            if (e.code === "Enter") {
                this.newSearchEvent(e);
            }
        });

        return $nav;
    }

    sideMenuOptionEvent(sideMenu) {

        const $hamburguerMenu = this.component.querySelector("#menuOption");

        $hamburguerMenu.addEventListener("click", () => sideMenu.toggle());
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

    searchVisibilityEvent() {

        const $elements = this.component.querySelectorAll("#searchOption, #x-search");

        if (!$elements) return;

        $elements.forEach(elem => {
            elem.addEventListener("click", e => {
                this.component.classList.toggle("searching")
            })
        })

    }


    sessionButtonEvents() {

        const $logInButton = this.component.querySelector("#logInButton")
        if ($logInButton) {

            $logInButton.addEventListener("click", e => {

                location.hash = "/login";
            })
        }

        const $signInButton = this.component.querySelector("#signInButton")
        if ($signInButton){

            $signInButton.addEventListener("click", e => {
                location.hash = "/registration";
            })
        }

    }

    newSearchEvent(evt) {

        const $searchInput = this.component.querySelector("#input-search");
        if (!$searchInput) return;

        const searchText = $searchInput.value.trim();

        if (searchText !== "") {

            Filter.addSearch(searchText);

            const event = new CustomEvent("newSearch");
            document.dispatchEvent(event);

            //redireccionar al home
            location.hash = "#/"
        }

    }

    changeLoggedStyle() {
        if (!this.component) return;
        if (Session.userInSession === true) this.component.classList.add("loggedIn");
        else this.component.classList.remove("loggedIn");
    }

    
}