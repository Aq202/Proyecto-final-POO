export class ImageCard{

    constructor(id, url){
        this.id = id;
        this.url = url;
        this.initComponent();
    }

    initComponent(){

        this.component = document.createElement("div");
        const $card = this.component;

        $card.classList.add("card");

        $card.innerHTML = `

        <img class="cardImage" src="${this.url}" alt="Vista previa imagen">

        <div class="deleteCard" title ="retirar imagen">
            <div></div>
        </div>
        `
    }
}