export class ImageViewer {


    constructor() {
        this.initComponent();

        this.numberOfImages = 0;
        this.currentIndex = 0;


    }

    initComponent() {

        this.component = document.createElement("div");
        const $imageViewer = this.component;

        $imageViewer.classList.add("imageViewer");

        $imageViewer.innerHTML = `

        <div class="viewerContainer">
            <div class="imagesList">
                <div class="carrousel">
                    
                </div>
            </div>
            <div class="viewerControls">

                <div class="arrowContainer">
                    <div class="arrowButton left">

                    </div>
                </div>
                <div class="arrowContainer right">
                    <div class="arrowButton right">

                    </div>
                </div>

                <div class="navigationBalls">
                    
                </div>

            </div>
        </div>
        
        `;

        //eventos de botones de cambiar imagen
        $imageViewer.querySelector(".arrowButton.left").addEventListener("click", () => this.moveLeft());
        $imageViewer.querySelector(".arrowButton.right").addEventListener("click", () => this.moveRight());

    }

    moveLeft() {

        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.moveCarrousel();
        }
    }

    moveRight() {

        if (this.currentIndex < (this.numberOfImages - 1)) {
            this.currentIndex++;
            this.moveCarrousel();
        }
    }

    moveCarrousel() {

        //mover el div contenedor de las imagenes
        const $carrousel = this.component.querySelector(".carrousel");
        if (!$carrousel) return;

        $carrousel.style.left = `-${this.currentIndex}00%`;
        this.selectNavigationBall();
    }


    selectNavigationBall() {

        //selecciona y añade un estilo distintivo a la bola que coincide con el indice actual

        const $currentBall = this.component.querySelector(`.navigationBalls span:nth-child(${this.currentIndex + 1})`);
        const $navigationBalls = this.component.querySelectorAll(".navigationBalls span");

        if (!$currentBall || !$navigationBalls) return;

        for (const $ball of $navigationBalls) {

            if ($currentBall === $ball) $currentBall.classList.add("selectedBall");
            else $ball.classList.remove("selectedBall");

        }

    }

    
    navigationBallEvent(evt){

        let index = 0;
        const $navigationBalls = this.component.querySelectorAll(".navigationBalls span");

        for(const $ball of $navigationBalls){
            
            if($ball === evt.target){
                this.currentIndex = index;
                break;
            }
            index++;
        }
        this.moveCarrousel();
    }

    addImage(url){

        const $carrousel = this.component.querySelector(".carrousel");
        const $navigationBalls = this.component.querySelector(".navigationBalls");
     
        if(!$carrousel || !$navigationBalls) return;
        

        //aumentar número de imagenes
        this.numberOfImages++;

        //crear y añadir imagen
        const $imageContainer = document.createElement("div");
        $imageContainer.innerHTML = `<img src="${url}" alt="Imagen ${this.numberOfImages}">`
        $carrousel.appendChild($imageContainer);


        //crear y añadir bola de navegación
        const $navigationBall = document.createElement("span");
        $navigationBall.addEventListener("click", e => this.navigationBallEvent(e)); //evento click
        $navigationBalls.appendChild($navigationBall);

        //modificar tamaño de carrousel
        $carrousel.style.width = `${this.numberOfImages}00%`
        $carrousel.style.gridTemplateColumns = `repeat(${this.numberOfImages}, 1fr)`;

        this.selectNavigationBall();

    }

    addFileImage(...images){

        //añadir imagenes locales del ordenador

        for(const image of images){

            const fileReader = new FileReader();

            fileReader.onload = event =>{
                
                if(event.target.readyState === 2){
                    this.addImage(event.target.result);
                }
            }

            fileReader.readAsDataURL(image);
        }
    }

    clear(){

        const $carrousel = this.component.querySelector(".carrousel");
        const $navigationBalls = this.component.querySelector(".navigationBalls");
     
        if(!$carrousel || !$navigationBalls) return;

        $carrousel.innerHTML = "";
        $navigationBalls.innerHTML = "";

        //resetear valores
        this.currentIndex = 0;
        this.numberOfImages = 0;

    }

}