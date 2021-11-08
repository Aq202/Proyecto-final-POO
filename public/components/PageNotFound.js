export class PageNotFound{

    constructor(){

        this.initComponent();
    }

    initComponent(){

        this.component = document.createElement("div");
        const $pageNotFound = this.component;

        $pageNotFound.id = "pageNotFound";

        $pageNotFound.innerHTML = `        
            <img src="images/others/page-not-found.svg" alt="pageNotFound">
            <h3>Página no encontrada</h3>
        `;


    }
}