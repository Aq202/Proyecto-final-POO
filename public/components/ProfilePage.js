import { DonationsContainer } from "./DonationsContainer.js";
import { Product } from "../scripts/Product.js";
import { Filter } from "../scripts/Filter.js";

export class ProfilePage{


    constructor(){
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

                    <img src="images/profileImages/1.jpg" alt="profile" class="profilePicture">

                    <div class="userName">
                        <h3>Diego Morales</h3>
                        <h4>@Aq202</h4>
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

        const donationsContainer = new DonationsContainer({});
        $profilePage.querySelector(".profileDonations").appendChild(donationsContainer.component)

        

        const { department, municipality, search, category } = Filter.filters;

        const productList = await Product.getProducts({ department, municipality, search, category });
            console.log(productList)
            if (productList.length > 0)
               donationsContainer.addContent(...productList);
            else
                donationsContainer.addNoResultsStyle();



    }
}