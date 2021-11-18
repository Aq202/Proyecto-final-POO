import { DonationRequest } from "../scripts/DonationRequest.js";
import { DonationRequestItem } from "./DonationRequestItem.js";

export class DonationRequestsContainer {

    constructor({ requests }) {

        this.requests = requests || [];
        this.requestsItems = [];

        this.initComponent();
    }

    initComponent() {

        this.component = document.createElement("div");
        const $requestsContainer = this.component;

        $requestsContainer.id = "donation-requests-container";
        $requestsContainer.classList.add("productInfo-section");

        $requestsContainer.innerHTML = `
            <h5 id="requests-title"> Solicitudes de donacion</h5>

            <div class="searchRequest">
                <div class="searchIcon"></div>
                <input type="text" placeholder="Buscar...">
            </div>
            
            <div class="requestsContainer scrollbar-gray">
            </div>
        `;

        this.createRequestsItem();
        this.renderRequestItems();

        //eventos
        $requestsContainer.querySelector(".searchRequest input").addEventListener("keyup", e => this.renderRequestItems())
        document.addEventListener("requestAccepted", e => this.renderRequestItems());

    }

    createRequestsItem() {
        for (let request of this.requests) {

            const requestObject = new DonationRequest(request);
            this.requestsItems.push(new DonationRequestItem(requestObject));
        }
    }

    renderRequestItems() {
   
        //obtener texto busqueda
        const search = this.getSearchText() || false;


        const $requestsContainer = this.component.querySelector(".requestsContainer");
        if (!$requestsContainer) return;

        //vaciar contenedor
        $requestsContainer.innerHTML = "";


        const fragment = document.createDocumentFragment();

        for (let requestItem of this.requestsItems) {
           
            //Ya se aceptó una solicitud
            if (requestItem?.selected === true) { 

                //estilo de solicitud ya aceptada
                this.component.classList.add("requestAlreadyAccepted");
                requestItem.component.classList.add("selectedRequest");

                //bloquear items
                this.blockItems();

                $requestsContainer.appendChild(requestItem.component) //
            }
            else if (search !== false) { //añadir items que coincidan con busqueda
                try {
                    if (requestItem.userName.toLowerCase().includes(search.toLowerCase())) {
                        fragment.appendChild(requestItem.component)
                    }
                } catch (ex) {

                }
            } else { //añadir todos

                fragment.appendChild(requestItem.component)

            }

        }
        $requestsContainer.appendChild(fragment);



    }

    getSearchText() {

        const $searchInput = this.component.querySelector(".searchRequest input");

        if (!$searchInput) return;

        const search = $searchInput.value.trim();

        if (search !== "") return search;
        else return;

    }

    blockItems(){
        for (let requestItem of this.requestsItems) {
            requestItem.block();
        }
    }


}