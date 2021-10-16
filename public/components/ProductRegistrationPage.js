import { ImagePicker } from "./ImagePicker.js";
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

                <h1>Nueva Donación</h1>
            
                <img src="../images/others/charity.svg" alt="Neva donación">
                <form>
                    <div class="inputContainer">
                        <input type="text" id="product-name">
                        <label for="product-name">Título</label>
                    </div>
                    <div class="inputContainer">
                        <textarea id="product-description" class="scrollbar-gray"></textarea>
                        <label for="product-description">Descripción</label>
                    </div>
                    <div class="inputContainer">
                        <select id="product-category">
                            <option value="">Telefonos</option>
                        </select>
                        <label for="product-category">Categoría</label>
                    </div>
                    <div class="inputContainer">
                        <select id="product-department">
                            <option value="">Telefonos</option>
                        </select>
                        <label for="product-department">Departamento</label>
                    </div>
                    <div class="inputContainer">
                        <select id="product-municipality">
                            <option value="">Telefonos</option>
                        </select>
                        <label for="product-municipality">Municipío</label>
                    </div>
            
                    <div class="filePicker"></div>

                    <input type="submit" id="send-donation-button" value="Realizar Donación" disabled>
                    <p class="errorMessage">Debes de llenar todas las casillas</p>
                    
                </form>
            </div>
            
            <div id="previewSection">
                
            </div>
        `;


        const $previewSection = $page.querySelector("#previewSection");
        const $formSection = $page.querySelector("#formSection .filePicker");

        const imagePicker = new ImagePicker();
        const imageViewer = new ImageViewer();

        //evento al cambiar los archivos seleccionados
        imagePicker.component.addEventListener("changeFile", e => {
            const files = e.detail;
            if(!files) return; 

            //actualizar imagenes
            imageViewer.clear();
            imageViewer.addFileImage(...files);

            //colocar imagen por defecto
            if(files.length === 0) imageViewer.addImage("../images/others/donate.png");
        })

        //añadir imagen por defecto
        imageViewer.addImage("../images/others/donate.png")

        $formSection.appendChild(imagePicker.component)
        $previewSection.appendChild(imageViewer.component)

    

        

        const $inputFile = $page.querySelector(".file");

        

        
    }
}