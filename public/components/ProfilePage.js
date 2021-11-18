import { DonationsContainer } from "./DonationsContainer.js";
import { Product } from "../scripts/Product.js";
import { Filter } from "../scripts/Filter.js";

export class ProfilePage {


    constructor({ userName, userAlias, profilePicture, donationsMade, donationsReceived }) {

        this.userName = userName;
        this.userAlias = userAlias;
        this.profilePicture = profilePicture || "images/profileImages/default.svg";
        this.donationsMade = (Array.isArray(donationsMade)) ? donationsMade : [];
        this.donationsReceived = (Array.isArray(donationsReceived)) ? donationsReceived : [];


        this.initComponent();
    }

    async initComponent() {

        this.component = document.createElement("div");
        const $profilePage = this.component;

        $profilePage.id = "profile-page";

        $profilePage.innerHTML = `
        
            <div class="banner"></div>
            <div class="profileData">

                <div class="dataContainer">

                    <div class="profilePicture-container profileImageStyle">
                        <img src="${this.profilePicture}" alt="profile" class="profilePicture">
                    </div>

                    <div class="userName">
                        <h3>${this.userName}</h3>
                        <h4>${this.userAlias}</h4>
                    </div>
                </div>

            </div>

            <div class="profileDonations">

                <div class="optionsMenu">
                    <div class="donationsMade">Donaciones Realizadas</div>
                    <div class="donationsReceived">Donaciones Recibidas</div>
                </div>

            </div>
        `;

        this.donationsContainer = new DonationsContainer({});
        $profilePage.querySelector(".profileDonations").appendChild(this.donationsContainer.component)

        this.loadDonationsMade(); //notificaciones hechas

        //agregar eventos
        this.component.querySelector(".donationsMade").addEventListener("click", e => this.loadDonationsMade(e));
        this.component.querySelector(".donationsReceived").addEventListener("click", e => this.loadDonationsReceived(e));


    }

    loadDonationsMade() {

        const button = this.component.querySelector(".donationsMade");
        this.removeSelectedStyle();
        if (button) button.classList.add("selected");

        this.donationsContainer.removeNoResultsStyle();
        this.donationsContainer.clear();

        if (this.donationsMade.length > 0) {
            this.donationsContainer.addContent(...this.donationsMade);
        } else {
            this.donationsContainer.addNoResultsStyle();
        }

    }

    loadDonationsReceived() {

        const button = this.component.querySelector(".donationsReceived");
        this.removeSelectedStyle();
        if (button) button.classList.add("selected");

        this.donationsContainer.removeNoResultsStyle();
        this.donationsContainer.clear();

        if (this.donationsReceived.length > 0) {

            this.donationsContainer.addContent(...this.donationsReceived);
        } else {
            this.donationsContainer.addNoResultsStyle();
        }

    }

    removeSelectedStyle() {

        const options = this.component.querySelectorAll(".optionsMenu > div");

        for (let option of options) {
            option.classList.remove("selected");
        }
    }

}