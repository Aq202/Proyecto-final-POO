
export class Banner {

    constructor() {



        this.data = [
            { image: "images/banners/banner1.jpg", title: "Nombre del proyecto" },
            { image: "images/banners/banner2.jpg", title: "Nombre del proyecto" },
            { image: "images/banners/banner3.jpg", title: "Nombre del proyecto" }
        ]

        this.bannerScreens = [];
        this.initComponent()



        console.log("cargado")
        this.startAnimationTimeLine()



    }


    initComponent() {

        this.element = document.createElement("DIV");
        this.element.id = "banner";

        this.slider = document.createElement("ul");
        this.slider.appendChild(this.addBannerScreens());


        //modificando ancho
        this.slider.style.width = `${this.data.length}00%`;
        this.slider.style.minWidth = `${this.data.length}00%`;


        this.element.appendChild(this.slider);
    }

    addBannerScreens() {

        const fragment = document.createDocumentFragment()

        for (let { image, title } of this.data) {

            const $bannerScreen = document.createElement("li");

            $bannerScreen.innerHTML = `
                <h3 class = "banSubtitle">Conviertete en el cambio.</h3>
                <h1 class = "banTitle">${title}</h1>
                <div class = "banButtons">
                    <a href="/" class="btn1">Donar</a>
                    <a href="/" class="btn2">Explorar</a>
                </div>
            `



            //agregando imagen
            $bannerScreen.style.backgroundImage = `url("${image}")`

            fragment.appendChild($bannerScreen);
            this.bannerScreens.push($bannerScreen)

        }

        return fragment;
    }

    showScreenElements(screenIndex) {


        const $screen = this.bannerScreens[screenIndex];

        const $titles = $screen.querySelectorAll("h1, h3")
        const $subtitle = $screen.querySelector("h3");
        const $button1 = $screen.querySelector("a:nth-child(1)");
        const $button2 = $screen.querySelector("a:nth-child(2)");


        const elementsAnimation = gsap.timeline();


        elementsAnimation.fromTo($titles, {opacity: 0, y:-10}, {opacity: 1, y:0, duration: 1}, 0)

        //elementsAnimation.from($button1, { y: 25, duration: 1 }, 0.5)
        elementsAnimation.fromTo($button1, {opacity: 0, y:0}, {opacity: 1, y:-25, duration: 1}, 0.5)

        //elementsAnimation.from($button2, { y: 25, duration: 1 }, 0.7)
        elementsAnimation.fromTo($button2, {opacity: 0, y:0}, {opacity: 1, y:-25, duration: 1}, 0.7)

        elementsAnimation.call(() => {

            this.typeAnimation = new Typed($subtitle, {
                strings: ["Conviertete en el cambio.", "Ayuda a otras personas.", "Reutiliza y sé amigable con el planeta.",],
                typeSpeed: 40,
                backSpeed: 40,
                showCursor: false,
                startDelay: 1000,
                backDelay: 2000,
            })



        })



    }

    hideScreenElements() {
        const elements = this.slider.querySelectorAll(".banTitle, .banSubtitle, a");
        if (!elements) return;

        elements.forEach(elem => {
            elem.style.opacity = 0;
            //elem.style.transform = "none";
        })

        this.typeAnimation.stop();
    }


    startAnimationTimeLine() {


        this.carrouselAnimation = gsap.timeline({ paused: true });

        for (let index = 1; index <= this.bannerScreens.length; index++) {

            this.carrouselAnimation.call(this.showScreenElements.bind(this), [index - 1])

            if (index != this.bannerScreens.length) {
                this.carrouselAnimation.to(this.slider, { css: { marginLeft: `-${(parseInt(index))}00%` }, ease: "power1.inOut", duration: 2, delay: 15 })
            }

            this.carrouselAnimation.call(this.hideScreenElements.bind(this))

        }

        this.carrouselAnimation.restart();


        //creando un bucle
        this.carrouselAnimation.eventCallback("onComplete", e => {

            //mover última posicion al inicio
            const lastScreen = this.bannerScreens[this.bannerScreens.length - 1];
            this.bannerScreens = this.bannerScreens.filter(elem => elem !== lastScreen)
            this.bannerScreens.unshift(lastScreen)

            //cambiar orden de elementos
            let order = 1;
            this.bannerScreens.forEach(screen => {
                screen.style.order = order;
                order++;
            })

            this.slider.style.marginLeft = 0;

            this.carrouselAnimation.restart()


        })

    }





}




