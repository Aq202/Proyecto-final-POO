import { Filter } from "../scripts/Filter.js";

export class FilterSection {

    constructor() {

        this.initComponent();
    }

    async initComponent() {

        this.component = document.createElement("div");
        const $filterSection = this.component;

        $filterSection.id = "filterSection";

        $filterSection.innerHTML = `

        
            <div id="searchFilter" class="filterItem">

                <div class="filterRow filterHeader ">
                    <span>Búsqueda</span>
                    <div class="xIcon"></div>
                </div>

                <div class="filterBody scrollbar-gray">

                    <p>Colchones</p>
                </div>

            </div>
            <div id="ubicationFilter" class="filterItem">

                <div class="filterRow filterHeader ">
                    <span>Ubicación</span>
                    <div class="arrowIcon"></div>
                </div>

                <div class="filterBody scrollbar-gray">

                    <span>Departamento</span>
                    <select id="departmentsSelect">
                        <option value="">Todos</option>
                        
                    </select>
                    <span>Municipio</span>
                    <select id="municipiosSelect">
                        <option value="">Todos</option>
                        
                    </select>
                </div>

            </div>
                    <div id="categoriesFilter" class="filterItem">

                <div class="filterRow filterHeader ">
                    <span>Categorias</span>
                    <div class="arrowIcon"></div>
                </div>

                <div class="filterBody scrollbar-gray">

                    <div class="filterRow">
                        <input id="selectAllCategories" type="checkbox" checked>
                        <label for="selectAllCategories">Seleccionar todas</label>
                    </div>
                    
                </div>
            </div> 
        `

        this.departmentsInfo = await Filter.departmentsOfGuatemala;

        this.slideToogle();
        this.addDepartmentsOptions();
        this.addMunicipalitiesOptions();
        this.addCategories();
        this.addSearch();


        //evento de selección de un departamento
        $filterSection.querySelector("#departmentsSelect").addEventListener("change", e => this.selectDepartment(e));
        $filterSection.querySelector("#municipiosSelect").addEventListener("change", e => this.selectMunicipality(e));
        
        //evento de seleccionar/deseleccionar todas las categorias
        $filterSection.querySelector("#selectAllCategories").addEventListener("change", e => this.selectAllCategories(e));

        //evento para agregar búsqueda(lanzado desde navbar)
        document.addEventListener("newSearch", e => this.addSearch(e));
        //evento quitar búsqueda
        $filterSection.querySelector("#searchFilter .xIcon").addEventListener("click", e => this.removeSearch(e));

    }


    slideToogle() {

        const $filterHeaders = this.component.querySelectorAll(".filterItem:not(#searchFilter) .filterHeader");

        for (const $filterHeader of $filterHeaders) {
            if ($filterHeader) {

                $filterHeader.addEventListener("click", e => {

                    const $filterItem = e.currentTarget.closest(".filterItem");
                    $filterItem.classList.toggle("upArrow");

                    const $filterBody = $filterItem.querySelector(".filterBody");
                    $($filterBody).stop();
                    $($filterBody).slideToggle(500);

                })

            }
        }

    }

    
    async addDepartmentsOptions() {
        
        if (this.departmentsInfo != undefined) {
            
            const $departamentoSelect = this.component.querySelector("#departmentsSelect");
            
            if (!$departamentoSelect) return;
            

            try {

                const fragment = document.createDocumentFragment();
                
                for (const department in this.departmentsInfo) {
                    
                    const $option = document.createElement("option");
                    $option.setAttribute("value", department);
                    $option.innerText = department;

                    //verificar si está seleccionado previamente
                    if(Filter.department === department){
                        $option.selected = true;
                    }
                    
                    fragment.appendChild($option);

                }
                
                $departamentoSelect.appendChild(fragment);

                
                
            } catch (err) {
                console.error("Error manual:: ", err);
            }

        }
    }
    
    addMunicipalitiesOptions() {

        const department = Filter.department;
        if (this.departmentsInfo != undefined) {
            
            const $municipiosSelect = this.component.querySelector("#municipiosSelect");
            if (!$municipiosSelect) return;
            
            try {
                
                //Vaciar las opciones
                $municipiosSelect.innerHTML = `<option value="">Todos</option>`
                
                
                if (this.departmentsInfo.hasOwnProperty(department)) {

                    //añadir opciones de municipios
                    const municipios = this.departmentsInfo[department];
                    
                    const fragment = document.createDocumentFragment();
                    
                    for (const municipio of municipios) {

                        const $option = document.createElement("option");
                        $option.setAttribute("value", municipio);
                        $option.innerText = municipio;

                        //verificar si está seleccionado previamente
                        if(Filter.municipality === municipio){
                         
                            $option.selected = true;
                        }
                        
                        fragment.appendChild($option);
                        
                    }
                    
                    $municipiosSelect.appendChild(fragment);
                    
                }
                
            } catch (ex) {
                
            }
        }
    }
    
    async selectDepartment(evt) {
        
        const departmentKey = evt.target.value;
        
        await Filter.setDepartment(departmentKey);  
        this.addMunicipalitiesOptions();      
        
    }

    selectMunicipality(evt){
        
        const municipalityKey = evt.target.value;
        
        Filter.setMunicipality(municipalityKey);  

    }


    addCategories() {
    
        const categories = Filter.defaultCategories;
        const $categoriesContainer = this.component.querySelector("#categoriesFilter .filterBody");
    
        if(!$categoriesContainer) return;
    
        const fragment = document.createDocumentFragment();
    
        for(let category of categories){
    
            const $categoryOption = document.createElement("div");
            $categoryOption.classList.add("filterRow");

            let checkedStatus = (Filter.categories === null || Filter.categories.includes(category)) ? "checked" : "";
    
            $categoryOption.innerHTML = `
                <input type="checkbox" id="${category}" value="${category}" ${checkedStatus}>
                <label for="${category}">${category}</label>            
            `;

            //agregando evento para modificar estado
            $categoryOption.querySelector("input").addEventListener("change", e => this.selectCategory(e));
    
            fragment.appendChild($categoryOption);
    
        }
    
        $categoriesContainer.appendChild(fragment);
    
    }

    selectCategory(evt){

        const category = evt.target.value;
        
        if(evt.target.checked){
            Filter.addCategory({category});
        }else{
            Filter.removeCategory({category});
        }
    }

    selectAllCategories(evt){

        const selected = evt.target.checked;

        const $categoriesElements = this.component.querySelectorAll("#categoriesFilter input[type='checkbox']");
        if(!$categoriesElements) return;    

        for(const element of $categoriesElements){
            element.checked = selected;
        }

        //actualizar
        if(selected === true) Filter.addCategory({addAll:true});
        else Filter.removeCategory({removeAll:true})


    }

    addSearch(){
        const searchText = Filter.search;

        if(searchText === null || searchText === undefined || searchText === "") return;

        //añadir searchContainer
        const $searchContainer = this.component.querySelector("#searchFilter");
        if(!$searchContainer) return;

        const $searchBox = $searchContainer.querySelector("p");
        if($searchBox) $searchBox.innerText = searchText;
        $searchContainer.style.display = "grid";

    }

    removeSearch(evt){

        const $searchContainer = this.component.querySelector("#searchFilter");

        //ocultar elemento
        if($searchContainer){
            $($searchContainer).fadeOut(400);
        }

        Filter.removeSearch();

    }

    
}