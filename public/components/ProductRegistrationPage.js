import { Filter } from "../scripts/Filter.js";
import { Product } from "../scripts/Product.js";
import { ImagePicker } from "./ImagePicker.js";
import { ImageViewer } from "./ImageViewer.js";

export class ProductRegistrationPage {

    constructor() {

        this.initComponent();

        this.name = "";
        this.description = "";
        this.category = "";
        this.department = "";
        this.municipality = "";
        this.imageFiles = [];


    }

    initComponent() {

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

                    <input type="submit" id="send-donation-button" value="Realizar Donación">
                    <p class="errorMessage"></p>
                    
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
            if (!files) return;

            //actualizar imagenes
            imageViewer.clear();
            imageViewer.addFileImage(...files);

            this.imageFiles = imagePicker.files;

            //colocar imagen por defecto
            if (files.length === 0) imageViewer.addImage("../images/others/donate.png");
        })




        //añadir contenido inicial del formulario
        this.addCategoriesOptions();
        this.addDepartmentsOptions();
        this.addMunicipalitiesOptions();

        //añadir imagen por defecto
        imageViewer.addImage("../images/others/donate.png")

        $formSection.appendChild(imagePicker.component)
        $previewSection.appendChild(imageViewer.component)


        //añadir evento de modificacion de formulario
        $page.querySelector("#product-name").addEventListener("keyup", e => this.selectName(e));
        $page.querySelector("#product-description").addEventListener("keyup", e => this.selectDescription(e));
        $page.querySelector("#product-department").addEventListener("change", e => this.selectDepartment(e));
        $page.querySelector("#product-municipality").addEventListener("change", e => this.selectMunicipality(e));
        $page.querySelector("#product-category").addEventListener("change", e => this.selectCategory(e));
        $page.querySelector("#send-donation-button").addEventListener("click", e => this.sendForm(e));


    }

    selectName(e) {
        if (e.target === undefined) return;
        this.name = e.target.value.trim();
    }

    selectDescription(e) {
        if (e.target === undefined) return;
        this.description = e.target.value.trim();
    }

    selectCategory(e) {
        if (e.target === undefined) return;
        this.category = e.target.value.trim();
    }

    selectDepartment(e) {
        if (e.target === undefined) return;
        this.department = e.target.value.trim();

        this.addMunicipalitiesOptions();
    }

    selectMunicipality(e) {
        if (e.target === undefined) return;
        this.municipality = e.target.value.trim();
    }


    addCategoriesOptions() {

        const $productCategory = this.component.querySelector("#product-category");

        if (!$productCategory) return;

        try {
            //vaciar contenido
            $productCategory.innerHTML = `<option value="">Seleccionar</option>`;

            const fragment = document.createDocumentFragment();

            for (const category of Filter.defaultCategories) {

                const $option = document.createElement("option");
                $option.setAttribute("value", category);
                $option.innerText = category;

                //verificar si está seleccionado previamente
                if (this.department === category) {
                    $option.selected = true;
                }
                fragment.appendChild($option);
            }

            $productCategory.appendChild(fragment);

        } catch (err) {
            console.error("Error manual:: ", err);
        }
    }

    async addDepartmentsOptions() {

        const $productDepartment = this.component.querySelector("#product-department");

        if (!$productDepartment) return;

        try {
            //vaciar contenido
            $productDepartment.innerHTML = `<option value="">Seleccionar</option>`;

            const fragment = document.createDocumentFragment();

            for (const department in await Filter.departmentsOfGuatemala) {

                const $option = document.createElement("option");
                $option.setAttribute("value", department);
                $option.innerText = department;

                //verificar si está seleccionado previamente
                if (this.department === department) {
                    $option.selected = true;
                }
                fragment.appendChild($option);
            }

            $productDepartment.appendChild(fragment);

        } catch (err) {
            console.error("Error manual:: ", err);
        }
    }

    async addMunicipalitiesOptions() {

        const $productMunicipality = this.component.querySelector("#product-municipality");
        const departmentsOfGuatemala = await Filter.departmentsOfGuatemala;
        if (!$productMunicipality || !departmentsOfGuatemala.hasOwnProperty(this.department)) return;

        try {
            //vaciar contenido
            $productMunicipality.innerHTML = `<option value="">Seleccionar</option>`;

            const fragment = document.createDocumentFragment();

            const municipalities = await Filter.departmentsOfGuatemala;

            for (const municipality of municipalities[this.department]) {

                const $option = document.createElement("option");
                $option.setAttribute("value", municipality);
                $option.innerText = municipality;

                //verificar si está seleccionado previamente
                if (this.department === municipality) {
                    $option.selected = true;
                }
                fragment.appendChild($option);
            }

            $productMunicipality.appendChild(fragment);

        } catch (err) {
            console.error("Error manual:: ", err);
        }
    }

    async validateData() {

        const data = {
            name: this.name,
            description: this.description,
            department: this.department,
            municipality: this.municipality,
            category: this.category
        }

        console.log(data)

        if (!this.component) return false;

        const departments = await Filter.departmentsOfGuatemala;

        //Validar nombre de producto
        if (this.name === "") {
            this.showError("El campo Titulo es obligatorio.");
            return false;
        }

        //Descripcion
        if (this.description === "") {
            this.showError("El campo descripción es obligatorio.");
            return false;
        }

        //Categoria
        if (!Filter.defaultCategories.includes(this.category)) {
            this.showError("El campo categoría es obligatorio.");
            return false;
        }

        //Departamento
        if (!departments.hasOwnProperty(this.department)) {
            this.showError("El campo departamento es obligatorio.")
            return false;
        }

        //Municipio
        if (!departments.hasOwnProperty(this.department) || !departments[this.department].includes(this.municipality)) {
            this.showError("El campo municipalidad es obligatorio.");
            return false;
        }

        if (this.imageFiles.length === 0) {
            this.showError("Debes ingresar al menos una imagen de tu donación.");
            return false;
        }

        this.showError("");
        return true;

    }

    async sendForm(e) {
        e.preventDefault();

        if (await this.validateData() === true) {

            try {

                const data = {
                    name: this.name,
                    description: this.description,
                    department: this.department,
                    municipality: this.municipality,
                    category: this.category
                }
                console.log("Iniciando petición...", data)
                await Product.createNewProduct(data);

                alert("Registro exitoso");

            } catch (ex) {
                this.showError("Ocurrió un error en el servidor.")
            }
        }
    }


    showError(errorMessage) {

        if (!this.component || errorMessage === undefined) return;

        const $errorElement = this.component.querySelector(".errorMessage");
        if (!$errorElement) return;

        $errorElement.style.display = "block";
        $errorElement.innerText = errorMessage.trim();
    }
}