export class LoadingView{

    constructor(){

        this.initComponent();
    }

    initComponent(){


        this.component = document.createElement("div");
        const $pageNotFound = this.component;

        $pageNotFound.id = "loadingView";

        $pageNotFound.innerHTML = `        
            <div class="spinner1">
                <div class="spinner2">
                    <div class="spinner3"></div>
                </div>
            </div>
        `;


    }
}