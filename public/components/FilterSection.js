export class FilterSection {

    constructor() {
        this.initComponent();
    }

    initComponent() {

        this.component = document.createElement("div");
        const $filterSection = this.component;

        $filterSection.id = "filterSection";

        $filterSection.innerHTML = `

        
<div id="ubicationFilter" class="filterItem">

<div class="filterRow filterHeader ">
    <span>Ubicación</span>
    <div class="arrowIcon"></div>
</div>

<div class="filterBody scrollbar-gray">

    <span>Departamento</span>
    <select>
        <option value="">Guatemala</option>
        <option value="">San Marcos</option>
        <option value="">Petén</option>
    </select>
    <span>Municipio</span>
    <select>
        <option value="">Guatemala</option>
        <option value="">San Marcos</option>
        <option value="">Petén</option>
    </select>
</div>

</div>
        <div class="filterItem">

    <div class="filterRow filterHeader ">
        <span>Categorias</span>
        <div class="arrowIcon"></div>
    </div>

    <div class="filterBody scrollbar-gray">
        <div class="filterRow">
            <input type="checkbox">
            <span>Ropa y accesorios</span>
        </div>
        <div class="filterRow">
            <input type="checkbox">
            <span>Teléfonos</span>
        </div>
        <div class="filterRow">
            <input type="checkbox">
            <span>Electrodomésticos</span>
        </div>
        <div class="filterRow">
            <input type="checkbox">
            <span>Electrodomésticos</span>
        </div>
        <div class="filterRow">
            <input type="checkbox">
            <span>Electrodomésticos</span>
        </div>
        <div class="filterRow">
            <input type="checkbox">
            <span>Electrodomésticos</span>
        </div>
        <div class="filterRow">
            <input type="checkbox">
            <span>Electrodomésticos</span>
        </div>
        <div class="filterRow">
            <input type="checkbox">
            <span>Electrodomésticos</span>
        </div>
        <div class="filterRow">
            <input type="checkbox">
            <span>Electrodomésticos</span>
        </div>
        <div class="filterRow">
            <input type="checkbox">
            <span>Electrodomésticos</span>
        </div>


    </div>
</div> 
        `


        this.slideToogle();
    }


    slideToogle() {

        const $filterHeaders = this.component.querySelectorAll(".filterHeader");

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
}