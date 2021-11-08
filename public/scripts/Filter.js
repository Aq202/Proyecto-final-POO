
export class Filter {

    static filters = {
        department: "",
        municipality: "",
        search: "",
        category: null
    }

    static blockEvent = false;

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
    static _departmentsOfGuatemala = null;

    static get departmentsOfGuatemala() {

        return new Promise((resolve, reject) => {

            if (this._departmentsOfGuatemala === null || this._departmentsOfGuatemala === undefined) {
                fetch("/helpers/Guatemala.json", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(r => r.json())
                    .then(result => {

                        this._departmentsOfGuatemala = result;
                        resolve(result);
                    })
                    .catch(err => reject(err))

            } else {
                resolve(this._departmentsOfGuatemala)
            }
        })

    }


    static setDepartment(department) {

        return new Promise((resolve, reject) => {

            Filter.departmentsOfGuatemala.then(departments => {

                if (departments.hasOwnProperty(department)) {
                    Filter.filters.department = department;

                } else {

                    Filter.filters.department = "";
                    Filter.filters.municipality = "";
                }
                Filter.throwFilterChangedEvent();

                resolve();
            })
        });
    }

    static get department() {
        return Filter.filters.department;
    }

    static setMunicipality(municipality) {

        return new Promise(async (resolve, reject) => {

            const departments = await Filter.departmentsOfGuatemala;
            const currentDepartment = Filter.filters.department;

            if (currentDepartment !== null && currentDepartment !== undefined) {

                if (departments[currentDepartment].includes(municipality)) {
                    Filter.filters.municipality = municipality;
                    Filter.throwFilterChangedEvent();
                    resolve();
                    return;
                }

            }

            Filter.filters.municipality = null;
            Filter.throwFilterChangedEvent();
            reject();

        });

    }

    static get municipality() {
        return Filter.filters.municipality;
    }

    static addCategory({ category, addAll }) {

        if (Filter.removedCategories.has(category)) {
            //se elimina de la lista
            Filter.removedCategories.delete(category);
        }

        if (addAll === true) {
            //vaciar lista de eliminados
            Filter.removedCategories.clear();
        }

        //añadiendo todas las categorias que no hayan sido deseleccionadas
        if (Filter.removedCategories.size === 0) Filter.filters.category = null;
        else Filter.filters.category = Filter.defaultCategories.filter(elem => !Filter.removedCategories.has(elem));

        Filter.throwFilterChangedEvent();
    }

    static removeCategory({ category, removeAll }) {

        if (!Filter.removedCategories.has(category)) {
            //añadir a la lista de eliminados
            Filter.removedCategories.add(category);
        }

        if (removeAll === true) {
            //añadir todas a la lista de eliminados
            Filter.defaultCategories.forEach(cat => Filter.removedCategories.add(cat));
        }

        //añadiendo todas las categorias que no hayan sido deseleccionadas
        if (Filter.removedCategories.size === 0) Filter.filters.category = null;
        else Filter.filters.category = Filter.defaultCategories.filter(elem => !Filter.removedCategories.has(elem));

        Filter.throwFilterChangedEvent();
    }
    static get categories() {
        return Filter.filters.category;
    }

    static addSearch(search) {

        try {
            const searchFilter = search.trim();
            if (searchFilter != "") Filter.filters.search = searchFilter;
            else Filter.filters.search = null;

        } catch (ex) {
            Filter.filters.search = null;
        }

        Filter.throwFilterChangedEvent();
    }


    static removeSearch() {
        Filter.filters.search = null;
        Filter.throwFilterChangedEvent();
    }

    static get search() {
        return Filter.filters.search;
    }

    static clearFilters() {
        Filter.filters.department = null;
        Filter.filters.municipality = null;
        Filter.filters.search = "";
        Filter.removeCategory({ removeAll: true })
        Filter.filters.category = null;
    }

    static throwFilterChangedEvent() {

        if (Filter.blockEvent !== true) {
            const event = new CustomEvent("filterChanged");

            document.dispatchEvent(event);
        }
    }


}