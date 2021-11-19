import { ManageRequestPopUp } from "./ManageRequestPopUp.js";

export class DonationRequestItem {

    constructor(donationRequestObject) {

        this.donationRequestObject = donationRequestObject || {};
        const { requestId, userId, userName, userAlias, profileImage, userEmail, userDPI, userGender, userAge, requestMessage, documents, date, selected } = this.donationRequestObject;

        console.log("SELECTED")
        moment.locale('es');

        this.requestId = requestId;
        this.userId = userId;
        this.userName = userName;
        this.profileImage = profileImage || "images/profileImages/default.svg";;
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

        if(this.donationRequestObject.loaded !== true) await this.donationRequestObject.getRequestFullData();
        
        const popUp = new ManageRequestPopUp(this.donationRequestObject);

        try {
            const result = await popUp.open();

            const event = new CustomEvent("requestChanged");
            document.dispatchEvent(event);

            if (result?.requestAccepted === true) {

                this.selected = true;

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