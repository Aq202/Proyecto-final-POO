import { NotificationItem } from "./NotificationItem.js";


export class NotificationTray{

    init(){
        this.$notificationTray = document.createElement("div");

        this.$notificationTray.setAttribute("id", "noti-panel")

        this.$notificationTray.innerHTML = `
            <div id="notification-list" class="scrollbar-blue">
                <div>
                   
                </div>
            </div>
            <div id="options-noti">
                <div id="noti-leidas">Marcar como leidas</div>
                <div id="noti-borrar">Vaciar</div>

            </div>
        `

        this.addLoadingSpinner();

        const fragment = document.createDocumentFragment();

        for(let i = 0; i<5; i++){
            const noti = new NotificationItem({
                id:"sdfsad",
                text:"Este es el cuerpo de la noti",
                image:`images/profileImages/${i+1}.jpg`,


            })
        
            fragment.appendChild(noti.init())

            
        }

        const panel = this.$notificationTray.querySelector("#notification-list > div");

        panel.appendChild(fragment)

        return this.$notificationTray
       
    }

    addLoadingSpinner(){

        //eliminando spinner
        let $spinner = document.querySelector(".loading-spinner");
        if ($spinner) $spi.remove();

        //agregando nuevo spinner
         $spinner = document.createElement("DIV");
        $spinner.classList.add("loading-spinner");
        $spinner.innerHTML = `<div class="spinner-border text-secondary" role="status"></div>`;
        
        const $notificationList = this.$notificationTray.querySelector("#notification-list > div");
        if($notificationList) $notificationList.appendChild($spinner);

    }
    
}