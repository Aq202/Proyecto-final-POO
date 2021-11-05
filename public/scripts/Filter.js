export class Filter {

    static filters = {
        department: "",
        municipality: "",
        search: "",
        category: null
    }

    static get defaultCategories() {
        return [
            "Ropa",
            "Electrodomésticos",
            "Fotografía",
            "Teléfonos",
            "Televisiones",
            "Calzado",
            "Artículos de bebé",
            "Juguetes",
            "Vehículos",
            "Computación",
            "Muebles",
            "Artículos de oficina",
            "Música",
            "Deportes",
            "Artículos del hogar"
        ]
    }

    static removedCategories = new Set();

    static get departmentsOfGuatemala() {

        return new Promise((resolve, reject) => {
            fetch("/helpers/Guatemala.json", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(r => r.json())
                .then(result => {

                    resolve(result);
                })
                .catch(err => reject(err))

        })

    }


    static setDepartment(department) {

        return new Promise((resolve, reject) => {

            Filter.departmentsOfGuatemala.then(departments => {

                if (departments.hasOwnProperty(department)) {
                    this.filters.department = department;

                } else {
                    
                    this.filters.department = "";
                    this.filters.municipality = "";
                }
                Filter.throwFilterChangedEvent();

                resolve();
            })
        });
    }

    static get department() {
        return this.filters.department;
    }

    static set municipality(municipality) {

        Filter.departmentsOfGuatemala.then(departments => {
            const currentDepartment = this.filters.department;

            if (currentDepartment !== null && currentDepartment !== undefined) {

                if (departments[currentDepartment].includes(municipality)) {
                    this.filters.municipality = municipality;
                    Filter.throwFilterChangedEvent();
                    return;
                }

            }

            this.filters.municipality = null;
            Filter.throwFilterChangedEvent();
        })
    }

    static get municipality() {
        return this.filters.municipality;
    }

    static addCategory({ category, addAll }) {

        if (this.removedCategories.has(category)) {
            //se elimina de la lista
            this.removedCategories.delete(category);
        }

        if (addAll === true) {
            //vaciar lista de eliminados
            this.removedCategories.clear();
        }

        //añadiendo todas las categorias que no hayan sido deseleccionadas
        if (this.removedCategories.size === 0) this.filters.category = null;
        else this.filters.category = this.defaultCategories.filter(elem => !this.removedCategories.has(elem));

        Filter.throwFilterChangedEvent();
    }

    static removeCategory({ category, removeAll }) {

        if (!this.removedCategories.has(category)) {
            //añadir a la lista de eliminados
            this.removedCategories.add(category);
        }

        if (removeAll === true) {
            //añadir todas a la lista de eliminados
            this.defaultCategories.forEach(cat => this.removedCategories.add(cat));
        }

        //añadiendo todas las categorias que no hayan sido deseleccionadas
        if (this.removedCategories.size === 0) this.filters.category = null;
        else this.filters.category = this.defaultCategories.filter(elem => !this.removedCategories.has(elem));

        Filter.throwFilterChangedEvent();
    }
    static get categories() {
        return this.filters.category;
    }

    static addSearch(search) {

        try {
            const searchFilter = search.trim();
            if (searchFilter != "") this.filters.search = searchFilter;
            else this.filters.search = null;

        } catch (ex) {
            this.filters.search = null;
        }

        Filter.throwFilterChangedEvent();
    }


    static removeSearch() {
        this.filters.search = null;
        Filter.throwFilterChangedEvent();
    }

    static get search() {
        return this.filters.search;
    }

    static throwFilterChangedEvent() {

        const event = new CustomEvent("filterChanged");

        document.dispatchEvent(event);
    }


}