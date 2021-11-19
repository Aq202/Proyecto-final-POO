import { Notification } from "../scripts/Notification.js";

export class NotificationItem {

    static lastNotification = null;
    static notifications = new Map();
    static pendingNotifications = [];

    constructor({ id, title, text, image, url, date, viewed }) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.image = image;
        this.url = url;
        this.date = date;
        this.viewed = viewed;

        this.title ||= "Nueva notificación"
        this.text ||= "Nueva notificación."
        this.image ??= "images/icons/logo.jpg"

        this.initComponent();
    }


    initComponent() {


        this.component = document.createElement("DIV");
        this.component.classList.add("cont-noti");
        this.component.innerHTML = `<img src="${this.image}">
                                <div class="texto">
                                    <div class="tit-noti">${this.title}</div>
                                    <div class="body-noti">${this.text}</div>
                                </div>
                                `;

        if (this.viewed === true) {
            this.component.classList.add("viewed")
        }

        //agregando evento para redirigir a url
        if (this.url != undefined && this.url != null)
            this.component.addEventListener("click", e => {
                location.hash = this.url;

                const event = new CustomEvent("hideNotificationTray");
                document.dispatchEvent(event);
            });

        this.addContextMenu()


        return this.component;
    }


    addContextMenu() {

        const $contextMenuContainer = document.createElement("DIV");
        $contextMenuContainer.classList.add("context-menu-container");

        const $optionIcon = document.createElement("SPAN");

        //creando menu de opciones
        const $contextMenu = document.createElement("DIV");
        $contextMenu.classList.add("context-menu")
        const $optionConfig = document.createElement("DIV"); //config
        const $optionSetAsViewed = document.createElement("DIV"); // visto
        $optionSetAsViewed.classList.add("option-setAsViewed")
        const $optionDelete = document.createElement("DIV"); //eliminar


        //colocar texto correspondiente
        $optionConfig.innerText = "Configuración";
        $optionDelete.innerText = "Eliminar";
        if (!this.viewed) $optionSetAsViewed.innerText = "Marcar como leído";
        else $optionSetAsViewed.innerText = "Marcar como no leído";

        //agregar opciones
        $contextMenu.appendChild($optionConfig);
        $contextMenu.appendChild($optionSetAsViewed);
        $contextMenu.appendChild($optionDelete);


        const showContextMenuEvent = e => {
            e.stopPropagation();

            NotificationItem.hideNotificationContextMenu()

            //mostrar menu actual
            $($contextMenu).fadeIn(200);

            const $notiPanel = document.getElementById("noti-panel");
            $notiPanel.classList.add("stop-scrolling"); //detener scroll

            //ocultar panel al hacer click fuera de el
            $notiPanel.addEventListener("click", e => {
                e.stopPropagation();
                NotificationItem.hideNotificationContextMenu();
            })
        }

        const redirectToConfigurationEvent = e => {
            e.stopPropagation();

            NotificationItem.hideNotificationContextMenu();
            alert("DIRIGIENDO A LA CONFIGURACION DE ")
        }

        const setAsViewedEvent = async e => {
            e.stopPropagation();

            console.log(e)

            NotificationItem.hideNotificationContextMenu();
            try {
                await Notification.setAsViewed(this.id);

                //  marcar/desmarcar como visto
                this.viewed = !this.viewed;
                this.changeViewedStyle();
                
            } catch (ex) {

            }
        }

        const deleteEvent = async e => {
            e.stopPropagation();

            NotificationItem.hideNotificationContextMenu();

            try {
                await Notification.delete(this.id);

                let notif = e.target.closest(".cont-noti");
                if (notif) {

                    gsap.to(notif, .5, {
                        scale: 0.8, opacity: 0, onComplete: () => {
                            notif.remove();
                        }
                    })
                }
            } catch (ex) {

            }
        }



        $optionIcon.addEventListener("click", showContextMenuEvent);
        $optionConfig.addEventListener("click", redirectToConfigurationEvent);
        $optionSetAsViewed.addEventListener("click", e => setAsViewedEvent(e));
        $optionDelete.addEventListener("click", deleteEvent);


        $contextMenuContainer.appendChild($optionIcon)
        $contextMenuContainer.appendChild($contextMenu);


        this.component.appendChild($contextMenuContainer)
    }


    static hideNotificationContextMenu() {
        let stopScroll = document.querySelector(".stop-scrolling");
        if (stopScroll) stopScroll.classList.remove("stop-scrolling");
        $(".context-menu").hide();
    }


    changeViewedStyle() {

        const menuOption = this.component.querySelector(".option-setAsViewed");
        
        if(!menuOption) return;

        if (this.viewed) {

            menuOption.innerText = "Marcar como no leído";
            this.component.classList.add("viewed");

        } else {

            menuOption.innerText = "Marcar como leído";
            this.component.classList.remove("viewed");

        }

    }
}