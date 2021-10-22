
export class Banner {

    constructor() {

        this.bannerData = [
            {
                image: "images/banners/banner1.jpg",
                title: "Nombre del proyecto",
                subtitles: ["&nbsp;Conviértete en el cambio1.", "&nbsp;Ayuda a otras personas1.", "&nbsp;Reutiliza y sé amigable con el planeta1.",]
            },
            {
                image: "images/banners/banner2.jpg",
                title: "Nombre del proyecto",
                subtitles: ["&nbsp;Conviértete en el cambio2.", "&nbsp;Ayuda a otras personas2.", "&nbsp;Reutiliza y sé amigable con el planeta2.",]

            },
            {
                image: "images/banners/banner3.jpg",
                title: "Nombre del proyecto",
                subtitles: ["&nbsp;Conviértete en el cambio3.", "&nbsp;Ayuda a otras personas3.", "&nbsp;Reutiliza y sé amigable con el planeta3.",]

            },
        ]

        this.initComponent()
        this.startAnimationTimeLine()

    }


    initComponent() {

        this.component = document.createElement("DIV");
        this.component.id = "banner";

        this.slider = document.createElement("ul");
        this.slider.appendChild(this.addBannerScreens());


        //modificando ancho
        this.slider.style.width = `${this.bannerData.length}00%`;
        this.slider.style.minWidth = `${this.bannerData.length}00%`;

        this.component.appendChild(this.slider);

        //añadir separador inferior
        const $separator = document.createElement("img");
        $separator.classList.add("separatorWave");
        $separator.setAttribute("src", "/images/waves/wave1.5.svg");

        this.component.appendChild($separator)
    }

    addBannerScreens() {

        const fragment = document.createDocumentFragment()

        for (let index in this.bannerData) {

            let { image, title } = this.bannerData[index];

            const $bannerScreen = document.createElement("li");

            $bannerScreen.innerHTML = `
                <h3 class = "banSubtitle">&nbsp;Conviertete en el cambio.</h3>
                <h1 class = "banTitle">${title}</h1>
                <div class = "banButtons">
                    <a href="/" class="btn1">Donar</a>
                    <a href="/" class="btn2">Explorar</a>
                </div>
            `

            //agregando imagen
            $bannerScreen.style.backgroundImage = `url("${image}")`

            fragment.appendChild($bannerScreen);
            this.bannerData[index].screen = $bannerScreen;

        }

        return fragment;
    }

    screenElementsAnimation(screenIndex) {

        const currentBannerData = this.bannerData[screenIndex];
        const $screen = currentBannerData.screen;

        const $titles = $screen.querySelectorAll("h1, h3")
        const $subtitle = $screen.querySelector("h3");
        const $button1 = $screen.querySelector("a:nth-child(1)");
        const $button2 = $screen.querySelector("a:nth-child(2)");


        const elementsAnimation = gsap.timeline();


        //aparición de elementos
        elementsAnimation.fromTo($titles, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 1 }, 0)
        elementsAnimation.fromTo($button1, { opacity: 0, y: 0 }, { opacity: 1, y: -25, duration: 1 }, 0.5)
        elementsAnimation.fromTo($button2, { opacity: 0, y: 0 }, { opacity: 1, y: -25, duration: 1 }, 0.7)

        const addTypeAnimation = () =>{

                //animación de escritura
                this.typeAnimation = new Typed($subtitle, {
                    strings: currentBannerData.subtitles,
                    typeSpeed: 40,
                    backSpeed: 40,
                    showCursor: false,
                    startDelay: 1000,
                    backDelay: 2000,
                })
        }

        elementsAnimation.call(addTypeAnimation)



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

        for (let index = 1; index <= this.bannerData.length; index++) {

            this.carrouselAnimation.call(this.screenElementsAnimation.bind(this), [index - 1])

            if (index != this.bannerData.length) {
                this.carrouselAnimation.to(this.slider, { css: { marginLeft: `-${(parseInt(index))}00%` }, ease: "power1.inOut", duration: 2, delay: 15 })
            }

            this.carrouselAnimation.call(this.hideScreenElements.bind(this))

        }

        this.carrouselAnimation.restart();


        //creando un bucle
        this.carrouselAnimation.eventCallback("onComplete", e => {

            //mover última posicion al inicio
            const lastScreen = this.bannerData[this.bannerData.length - 1];
            this.bannerData = this.bannerData.filter(elem => elem !== lastScreen)
            this.bannerData.unshift(lastScreen)

            //cambiar orden de elementos
            let order = 1;
            this.bannerData.forEach(bannerScreen => {
                bannerScreen.screen.style.order = order;
                order++;
            })

            this.slider.style.marginLeft = 0;

            this.carrouselAnimation.restart()


        })

    }





}




