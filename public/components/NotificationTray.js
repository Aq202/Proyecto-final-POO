import { NotificationSocketClient } from "../scripts/notificationSocketClient.js";
import { NotificationItem } from "./NotificationItem.js";


export class NotificationTray {


    static loadedNotifications = new Map();


    constructor() {

        this.initialized = false;
        this.loadingLock = false;
        this.lastNotification = null;
        this.pendingNotifications = [];

        this.observer = new IntersectionObserver(this.loadOldNotifications.bind(this), {
            threshold: 0.9
        })



        const userData = JSON.parse(localStorage.getItem("userData"));
        /*if(userData)  new NotificationSocketClient(userData.user);*/

        this.initComponent();
    }

    initComponent() {
        this.component = document.createElement("div");

        this.component.setAttribute("id", "noti-panel")

        this.component.innerHTML = `
            <div id="notification-list" class="scrollbar-blue">
                
            </div>
            <div id="options-noti">
                <div id="noti-leidas">Marcar como leidas</div>
                <div id="noti-borrar">Vaciar</div>

            </div>
        `

        //escuchar notificaciones
        document.addEventListener("newNotification", e => this.addEmergentNotification(e.detail))


        this.addLoadingSpinner();

        return this.component

    }


    addEmergentNotification(notificationData) {

        if (this.initialized === false) {
            this.pendingNotifications.push(notificationData);

        } else if (this.initialized === true) { //agregar notificacion
            console.log(notificationData)
            const notificationItem = new NotificationItem(notificationData).component;

            const $panel = this.component.querySelector("#notification-list");

            if (!$panel || !notificationData.id) return;
            $panel.insertAdjacentElement("afterbegin", notificationItem);
            NotificationTray.loadedNotifications.set(notificationData.id, notificationItem)

        }
    }

    async initializeContent() {

        if (this.initialized !== true && this.loadingLock !== true) {


            try {

                await this.loadNotifications(10);


            } catch (ex) {
                console.error("InitializeContent method:: ", ex)
                if (this.pendingNotifications.length === 0) {
                    this.addEmptyMessage();
                }
            } finally {
                this.initialized = true;
                this.loadingLock = false;
                this.removeLoadingSpinner();

                //cargar notificaciones pendientes
                for (let pendingNotificationData of this.pendingNotifications) {

                    this.addEmergentNotification(pendingNotificationData);
                }

            }
        }
    }

    loadNotifications(max) {
        return new Promise((resolve, reject) => {

            this.loadingLock = true;

            let url = "/fakeNotifications";
            let data = {
                lastNotification: this.lastNotification,
                max: max
            }
            fetch(url, {
                method: "post",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(r => r.json())
                .then(result => {
                    console.log(result)
                    //añadir elementos de notificacion

                    if (result.notifications == undefined || result.notifications.length === 0) reject();

                    const $panel = this.component.querySelector("#notification-list");
                    if (!$panel) reject();

                    const fragment = document.createDocumentFragment();

                    for (let notification of result.notifications) {

                        if (!notification.id) continue;

                        const notificationItem = new NotificationItem(notification);

                        fragment.appendChild(notificationItem.component);
                        NotificationTray.loadedNotifications.set(notification.id, notificationItem);
                    }

                    $panel.appendChild(fragment);

                    //agregando observer al último elemento
                    if ($panel.lastChild.matches(".cont-noti")) {

                        this.observer.observe($panel.lastChild);

                    }

                    resolve();

                }).catch(error => reject(error));
        });
    }

    loadOldNotifications(entry) {

        if (entry[0].isIntersecting) {

            setTimeout(async () => {

                this.observer.unobserve(entry[0].target);
                this.addLoadingSpinner();

                try {
                    await this.loadNotifications(0);
                } catch (ex) {
                    console.error("LoadOldNotificationS:: ", ex)
                } finally {
                    this.removeLoadingSpinner();
                }



            }, 500)
        }

    }

    addLoadingSpinner() {

        this.removeLoadingSpinner();

        //agregando nuevo spinner
        const $spinner = document.createElement("DIV");
        $spinner.classList.add("loading-spinner");
        $spinner.innerHTML = `<div class="spinner-border text-secondary" role="status"></div>`;

        const $notificationList = this.component.querySelector("#notification-list");
        if ($notificationList) $notificationList.appendChild($spinner);

    }

    removeLoadingSpinner() {
        const $spinner = this.component.querySelector(".loading-spinner");
        if ($spinner) $spinner.remove();
    }

    addEmptyMessage() {
        console.log("agregando mensaje vacio")
        //eliminando mensajes anteriores
        let panel = document.querySelector(".empty-panel-message");
        if (panel) panel.remove();

        //agregando mensaje
        const $elem = document.createElement("DIV");
        $elem.classList.add("empty-panel-message");
        $elem.innerText = "Sin notificaciones nuevas";

        const $panel = this.component.querySelector("#notification-list");
        if ($panel) $panel.insertAdjacentElement("afterbegin", $elem);
    }

}