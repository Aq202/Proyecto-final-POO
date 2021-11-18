import { DonationsContainer } from "./DonationsContainer.js";
import { Product } from "../scripts/Product.js";
import { Filter } from "../scripts/Filter.js";

export class ProfilePage{


    constructor({userName, userAlias, profilePicture, donationsMade, donationsReceived}){

        this.userName = userName;
        this.userAlias = userAlias;
        this.profilePicture = profilePicture || "images/profileImages/default.svg";
        this.donationsMade = (Array.isArray(donationsMade)) ? donationsMade : [];
        this.donationsReceived = (Array.isArray(donationsReceived)) ? donationsReceived : [];


        this.initComponent();
    }

    async initComponent(){

        this.component = document.createElement("div");
        const $profilePage = this.component;

        $profilePage.id = "profile-page";

        $profilePage.innerHTML = `
        
            <div class="banner"></div>
            <div class="profileData">

                <div class="dataContainer">

                    <img src="${this.profilePicture}" alt="profile" class="profilePicture">

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

        this.loadDonations(); //notificaciones hechas

        //agregar eventos
        this.component.querySelector(".donationsMade").addEventListener(e => this.loadDonations());
        this.component.querySelector(".donationsReceived").addEventListener(e => this.loadDonations(true));


    }

    loadDonations(donationsReceived){
        
        if(donationsReceived === true){ //agregar donaciones recibidas
            if(this.donationsReceived.length > 0){
                this.donationsContainer.addContent(...this.donationsReceived);
            }else{
                this.donationsContainer.addNoResultsStyle();
            }
        }else{ //notificaciones hechas
            if(this.donationsMade.length > 0){
                this.donationsContainer.addContent(...this.donationsMade);
            }else{
                this.donationsContainer.addNoResultsStyle();
            }

        }

    }
}