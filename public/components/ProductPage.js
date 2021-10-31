import { ImageViewer } from "./ImageViewer.js";
import { Product } from "../scripts/Product.js";

export class ProductPage {

    constructor({productId, cathegory, municipality, title, description, profileImage, name, productImages}) {

        this.productId = productId || null;
        this.cathegory = cathegory;
        this.municipality = municipality;
        this.title = title;
        this.description = description;
        this.profileImage = profileImage;
        this.authorName = name;
        this.productImages = productImages;

        this.initComponent();

    }

    initComponent() {

        this.component = document.createElement("div");
        const $productPage = this.component;

        $productPage.id = "productPage";

        $productPage.innerHTML = `
        <div id="productPage-container">
    
        <div id="main-product-container">
    
            <div id="productImage"></div>
            <div id="productInfo">
            <div id="productInfo-container">
    
                <div class="tags">
                    <span id="cathegory">${this.cathegory}</span>
                    <span class="separator">|</span>
                    <span id="place">${this.municipality}</span>
                </div>
    
                <h1 id="product-title">${this.title}</h1>
    
                <div id="product-author">
                    <img src="${this.profileImage}" alt="profile">
                    <span>${this.authorName}</span>
                </div>
    
                <p id="product-description">${this.description}</p>
    
                <div id="product-buttons">
                    <button class="requestDonation">Solicitar</button>
                </div>
            </div>
            </div>
        </div>
    </div>
        
        `;

        //añadir visor de imagenes
        const imageViewer = new ImageViewer();
        for (let imageUrl of this.productImages) {
            imageViewer.addImage(imageUrl);
        }

        $productPage.querySelector("#productImage").appendChild(imageViewer.component)
    }
}