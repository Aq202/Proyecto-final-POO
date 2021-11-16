import { Filter } from "../scripts/Filter.js";
import { DonationItem } from "./DonationItem.js";

export class DonationsContainer {


    constructor({ lazyLoad }) {

        this.lazyLoad = lazyLoad || true;
        this.itemsCount = 0;
        this.contentLoaded = new Set();

        this.initComponent();

    }

    initComponent() {

        this.component = document.createElement("div");
        const $donationContainer = this.component;

        $donationContainer.setAttribute("id", "donationsContainer");

        $donationContainer.innerHTML = `
            <div class="spinner-container">
                <div class="spinner-border text-dark spinner" role="status"></div>
            </div>
            <div class="no-results-message">
                <img src="images/others/not-found.svg" alt="Not found">
                <h3>No se encontraron resultados</h3>
            </div>
            <div class="products-container"> </div>
        `;

        this.observer = new IntersectionObserver(e => this.throwFullySeenEvent(e));


    }

    addContent(...donationsData) {

        const productContainer = this.component.querySelector(".products-container");
        if (!productContainer) return;

        const fragment = document.createDocumentFragment();

        for (let donationObject of donationsData) {

            try {

                const { name, owner, publishDate, images, ownerImage, _id } = donationObject;

                if (name === undefined || owner === undefined || publishDate === undefined || images[0] === undefined) continue;

                if (!this.contentLoaded.has(_id)) {

                    fragment.appendChild(new DonationItem({
                        title: name,
                        donationImage: images[0],
                        ownerImage,
                        date: publishDate,
                        donationPath: `/#/product?productId=${_id}`
                    }).component);

                    this.itemsCount++;
                    this.contentLoaded.add(_id);
                }

            } catch (ex) {

            }
        }


        productContainer.appendChild(fragment);

        //agregando observer al último elemento
        if (productContainer.lastChild != null && productContainer.lastChild.matches(".donationItem")) {
            this.observer.observe(productContainer.lastChild);
        }


    }

    clear() {
        const productContainer = this.component.querySelector(".products-container");
        if (!productContainer) return;
        productContainer.innerHTML = "";
        this.itemsCount = 0;
        this.contentLoaded.clear();
    }

    throwFullySeenEvent(entry) {
        if (entry[0].isIntersecting) {

            this.observer.unobserve(entry[0].target)
            const event = new CustomEvent("fullySeen");
            this.component.dispatchEvent(event);
        }
    }

    addLoadingStyle() {
        this.component.classList.add("loading");
    }

    removeLoadingStyle() {
        this.component.classList.remove("loading");
    }

    addNoResultsStyle() {
        this.component.classList.add("no-results");
    }

    removeNoResultsStyle() {
        this.component.classList.remove("no-results");
    }


}