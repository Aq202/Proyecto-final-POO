import { NotificationTray } from "./NotificationTray.js";

export class NavBar{

    constructor({id, name, profileImage}){

        this._userId = id;
        this._userName = name;
        this._userImageUrl = profileImage;        

    }

    init(){

        const $nav = document.createElement("nav");

        $nav.setAttribute("id", "navBar");
        
        $nav.innerHTML = `
        <div class="navigationIcons">
            <button id="menuOption" class="navigationIcons"></button>
        </div>
        <div id='search'>
            <div id='search-input-containor'>
                
                <input type='text' id='input-search' placeholder='Buscar...'>
                <button id="lupa-search"></button>
            </div>

            <div id="search-suggestions"> </div>
        </div>

        <div id="navigationIconsContainer">

            <div id="notification-section" class="navigationIcons">
                <button id="notificationsOption"></button>
            </div>
            <div class="navigationIcons">
                <button id="donationsOption"></button>
            </div>
            <div class="navigationIcons">
                <button id="chatOption"></button>
            </div>
            <div class="navigationIcons">
                <img src="${this._userImageUrl}" alt="${this._userName}" }" id="userImage">
            </div>
            
        </div>
              
        `

        //agregar paneles de notificaciones
        const $notificationTray = new NotificationTray().init();
        const $notificationSection = $nav.querySelector("#notification-section")
        if($notificationSection) $notificationSection.appendChild($notificationTray);




        return $nav;
    }
}