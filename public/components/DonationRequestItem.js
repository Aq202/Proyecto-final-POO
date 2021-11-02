import { ManageRequestPopUp } from "./ManageRequestPopUp.js";

export class DonationRequestItem {

    constructor(donationRequestObject) {

        this.donationRequestObject = donationRequestObject || {};
        const { requestId, userId, userName, userAlias, profileImage, userEmail, userDPI, userGender, userAge, requestMessage, documents, date, selected } = this.donationRequestObject;

        moment.locale('es');

        this.requestId = requestId;
        this.userId = userId;
        this.userName = userName;
        this.profileImage = profileImage;
        this.date = moment(date).fromNow();
        this.selected = selected || false;
        this.actionBlocked = false;

        this.initComponent();
    }

    initComponent() {

        this.component = document.createElement("div");
        const $requestItem = this.component;

        $requestItem.classList.add("requestItem");
        if (this.selected === true) $requestItem.classList.add("selectedRequest");

        $requestItem.innerHTML = `
            <div>
                <img src="${this.profileImage}" alt="profile">
                <span class="userName">${this.userName}</span>
            </div>
            <span class="requestDate">${this.date}</span>
        `;

        $requestItem.addEventListener("click", e => this.showInfoPopUp());
    }

    async showInfoPopUp() {

        if(this.actionBlocked !== false) return;

        const popUp = new ManageRequestPopUp(this.donationRequestObject);

        try {
            const result = await popUp.open();

            if (result?.requestAccepted === true) {

                this.selected = true;

                const event = new CustomEvent("requestAccepted");
                document.dispatchEvent(event);

            }else{
                this.component.remove()
            }

        } catch (ex) {

        }



    }

    block(){
        this.actionBlocked = true;
    }

}