import { RandomFunctions } from "../helpers/RandomFunctions.js";
import { ImageCard } from "./ImageCard.js";

export class ImagePicker {

    constructor() {
        this.initComponent();
        this._files = new Map();
    }

    initComponent() {
        this.component = document.createElement("div");
        const $imagePicker = this.component;

        $imagePicker.classList.add("imagePicker");

        $imagePicker.innerHTML = `
        
        <div class="scrollbar-gray">
            <div class="inputFileContainer card">
                <div class="fileInputInfo">
                    <div class="uploadIcon"></div>
                    <span class="boldSpan">Añade una foto</span>
                    <span>Haz click o arrastra y suelta una imagen</span>
                </div>
                <input type="file" class="inputFile" name="files" multiple>
            </div>  
        </div>
        `;

        $imagePicker.addEventListener("change", e => {
            this.loadFileImages(e)
        });

    }

    changeStyle() {

        if(this.files.length > 0) this.component.classList.add("galleryStyle");
        else this.component.classList.remove("galleryStyle");
        
    }

    loadFileImages(evt) {

        const images = evt.target.files;

        if (!images) return;

        for (const image of images) {
            
            const id = RandomFunctions.getRandomString(15);
            const fileReader = new FileReader();

            fileReader.onload = event => {

                if (event.target.readyState === 2) {
                    this.addImageCard(id, event.target.result);
                }
            }

            fileReader.readAsDataURL(image);
            this._files.set(id, image);
            

        }
                
        this.emmitChangeEvent();
    }

    emmitChangeEvent(){
        const changeEvent = new CustomEvent("changeFile", {
            detail:this.files
        });
        this.component.dispatchEvent(changeEvent);
    }

    addImageCard(id, url) {

        this.changeStyle();

        const $fileInputContainer = this.component.querySelector(".inputFileContainer.card");

        if (!$fileInputContainer) return;

        
        const card = new ImageCard(id, url);
        const $card = card.component;

        //evento click eliminar
        $card.addEventListener("click", e => this.deleteImage(card));

        //añadir carta antes del input file
        $fileInputContainer.insertAdjacentElement("beforebegin", $card);
    }

    get files(){
        return Array.from(this._files.values());
    }

    
    deleteImage(card){
        if(!card) return;
        
        card.component.remove();
        this._files.delete(card.id);

        this.emmitChangeEvent();    
        this.changeStyle();
    }
}