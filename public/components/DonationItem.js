export class DonationItem {

    constructor({title, donationImage, ownerImage, date, donationPath: path}) {

        this.title = title;
        this.donationImage = donationImage;
        this.ownerImage = ownerImage;
        this.date = date;
        this.path = path;

        this.initComponent();
    }

    initComponent() {

        this.component = document.createElement("div");
        const $donationItem = this.component;

        $donationItem.classList.add("donationItem")

        $donationItem.innerHTML =
            `<div class='cont-img'>
                <img src='${this.donationImage}' alt='${this.title}'>
            </div>
            <div class='cont-info'>
                <img class='rounded-circle' src='${this.ownerImage}' alt='ImgAutor'>
                <span>${this.date}</span>
                <a href='${this.path}'>${this.title}</a>
            </div>`;

    }
}