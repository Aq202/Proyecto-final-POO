export class Footer{

    constructor(){
        this.initComponent();
    }

    initComponent(){
        this.component = document.createElement("footer");
        const $footer = this.component;

        $footer.innerHTML = `
        
        <img src="../images/waves/wave3.svg" alt="Wave" class="footerWave">
        
        `;

    }

}