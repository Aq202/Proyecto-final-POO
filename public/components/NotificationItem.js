
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
                alert("Redirigiendo a: " + this.url);
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

        const setAsViewedEvent = e => {
            e.stopPropagation();

            NotificationItem.hideNotificationContextMenu();

            //  marcar/desmarcar como visto
            if (!this.viewed) {

                this.viewed = true;
                e.currentTarget.innerText = "Marcar como no leído";
                let notif = e.currentTarget.closest(".cont-noti");
                if (notif) notif.classList.add("viewed");

            } else {

                this.viewed = false;
                e.currentTarget.innerText = "Marcar como leído";
                let notif = e.currentTarget.closest(".cont-noti");
                if (notif) notif.classList.remove("viewed");

            }
        }

        const deleteEvent = e => {
            e.stopPropagation();

            NotificationItem.hideNotificationContextMenu();

            let notif = e.currentTarget.closest(".cont-noti");
            if (notif) {

                gsap.to(notif, .5, {
                    scale: 0.8, opacity: 0, onComplete: () => {
                        notif.remove();
                    }
                })
            }
        }



        $optionIcon.addEventListener("click", showContextMenuEvent);
        $optionConfig.addEventListener("click", redirectToConfigurationEvent);
        $optionSetAsViewed.addEventListener("click", setAsViewedEvent);
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
}