import { ImageViewer } from "./ImageViewer.js";

export class ProductRegistrationPage{
    
    constructor(){

        this.initComponent();

    }

    initComponent(){

        this.component = document.createElement("div");
        const $page = this.component;

        $page.id = "productRegistrationPage";

        $page.innerHTML = `
            <div id="formSection">

            </div>
            
            <div id="previewSection">

            <input type="file" class="file" multiple/>
                
            </div>
        `;


        const previewSection = $page.querySelector("#previewSection");

        const imageViewer = new ImageViewer()

        imageViewer.addImage("https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-13/Pink/Apple-iPhone-13-Pink-thumbnail.png")
        imageViewer.addImage("https://img.global.news.samsung.com/mx/wp-content/uploads/2019/01/Notebook-9-Pro-3.jpg")
        imageViewer.addImage("https://photos.encuentra24.com/t_or_fh_s/f_auto/v1/gt/19/69/80/75/19698075_c7269d");

        previewSection.appendChild(imageViewer.component)

        const $inputFile = $page.querySelector(".file");

        $inputFile.addEventListener("change", evt =>{
            const files = evt.target.files;

            imageViewer.clear();
            imageViewer.addFileImage(...files);
        })

        
    }
}