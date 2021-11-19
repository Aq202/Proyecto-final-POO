
import { Notification } from "../scripts/Notification.js";
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

        this.component.querySelector("#noti-leidas").addEventListener("click", e => this.setAllNotificationsAsViewed());
        this.component.querySelector("#noti-borrar").addEventListener("click", e => this.deleteAllNotifications());

        this.addLoadingSpinner();

        return this.component

    }


    addEmergentNotification(notificationData) {

        if (this.initialized === false) {
            this.pendingNotifications.push(notificationData);

        } else if (this.initialized === true) { //agregar notificacion
            if(!NotificationTray.loadedNotifications.has(notificationData.id)){
            this.removeEmptyMessage();

            const notificationItem = new NotificationItem(notificationData);

            const $panel = this.component.querySelector("#notification-list");

            if (!$panel || !notificationData.id) return;
            $panel.insertAdjacentElement("afterbegin", notificationItem.component);
            NotificationTray.loadedNotifications.set(notificationData.id, notificationItem)
            }else{
                console.log("Notificación bloqueada por estar repetida");
            }
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

    async loadNotifications() {

        this.removeEmptyMessage();

        try {
            const notifications = await Notification.getNotifications({ quantity: 10, skip: NotificationTray.loadedNotifications.size });

            if (Array.isArray(notifications) && notifications.length > 0) {

                const $panel = this.component.querySelector("#notification-list");
                if (!$panel) return this.addEmptyMessage();

                const fragment = document.createDocumentFragment();

                for (let notif of notifications) {
                    const hola = NotificationTray.loadedNotifications;
                    if (!notif._id) continue;
                    debugger
                    if(NotificationTray.loadedNotifications.has(notif._id) === true) continue;

                    const notifItem = new NotificationItem({
                        id: notif._id,
                        title: notif.title,
                        text: notif.text,
                        image: notif.image,
                        url: notif.url,
                        date: notif.date,
                        viewed: notif.viewed
                    });

                    fragment.appendChild(notifItem.component);
                    NotificationTray.loadedNotifications.set(notif._id, notifItem);

                    $panel.appendChild(fragment);

                }

                //agregando observer al último elemento
                if ($panel.lastChild.matches(".cont-noti")) {

                    this.observer.observe($panel.lastChild);

                }

            } else {
                this.addEmptyMessage();
            }
        } catch (ex) {
            this.addEmptyMessage();
        }
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

    async setAllNotificationsAsViewed() {

        try {
            await Notification.setAllAsViewed();

            for (let notif of NotificationTray.loadedNotifications.values()) {
                notif.viewed = true;
                notif.changeViewedStyle();
            }
        } catch (ex) {

        }
    }

    async deleteAllNotifications() {

        try {
            await Notification.deleteAll();

            for (let notif of NotificationTray.loadedNotifications.values()) {
                notif.component?.remove();
            }
            NotificationTray.loadedNotifications.clear();
            this.addEmptyMessage();
        } catch (ex) {

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

        if (NotificationTray.size === 0) {
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

    removeEmptyMessage() {

        const $message = this.component.querySelector(".empty-panel-message");
        if (!$message) return;
        $message.remove();
    }

}