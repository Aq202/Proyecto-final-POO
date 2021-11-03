import { Session } from "./Session.js";

export class Product {

    static createNewProduct({ name, category, department, municipality, description }) {

        return new Promise((resolve, reject) => {

            if (!Session.userInSession) reject();

            const obj = {
                name,
                cathegory: category,
                department,
                municipality,
                description
            }

            let reqObject;

            fetch("/product/addProduct", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    'Authorization': Session.token,
                    "Content-Type": "application/json"
                }
            })
                .then(r => {
                    reqObject = r;
                    return r.json();
                })
                .then(res => {

                    if(reqObject.ok === true) resolve(res);
                    else reject(res);
                })
                .catch(err => reject(err));

        });

    }

    static getProductData(productId) {

        return new Promise((resolve, reject) => {
            resolve({
                productId:"asdfñkl",
                cathegory: "Tecnología",
                municipality: "Villa Nueva",
                title: "Cámara nueva canon",
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia soluta eius commodi aut ducimus reiciendis voluptatem laudantium dolorum? Aperiam eius maxime, quaerat tempore fuga esse alias consequatur quis explicabo quam.",
                profileImage: "images/profileImages/1.jpg",
                name: "Diego Morales",
                productImages:[
                    "http://cdn.shopify.com/s/files/1/0101/2522/files/dslr-manual-focus_grande.jpg?3541",
                    "https://www.geovirtual2.cl/Entrada/Camara-Pentax-2015-01n.jpg",
                    "https://mott.pe/noticias/wp-content/uploads/2017/09/Las-5-mejores-c%C3%A1maras-de-fotos-compactas-usadas-por-fot%C3%B3grafos-profesionales-1280x720.jpg"
                ]

            })
        })
    }

    static newRequestOfDonation({user, productId}){

        return new Promise((resolve, reject) => {

            setTimeout(() => {
                
                resolve();
            }, 5000);
        })
    }

    static deleteProduct(productId){

        return new Promise((resolve,reject) => {

            if(productId === undefined || productId === null) reject("Id invalido.");

            setTimeout(() => {
                resolve();
            }, 3000);
        })
    }


    static getProducts(max){


        return new Promise((resolve, reject) => {

            setTimeout(() => {
                
           
            resolve([

                {
                    date: "Hace 1 día",
                    donationImage: "http://cdn.shopify.com/s/files/1/0101/2522/files/dslr-manual-focus_grande.jpg?3541",
                    donationPath: "/",
                    ownerImage: "http://localhost:2004/images/profileImages/1.jpg",
                    title: "Cuna para bebé"
                },

                {
                    date: "Hace 1 día",
                    donationImage: "https://curiosfera-historia.com/wp-content/uploads/historia-de-la-cuna-1.jpg",
                    donationPath: "/",
                    ownerImage: "http://localhost:2004/images/profileImages/2.jpg",
                    title: "Cuna para bebé"
                },

                {
                    date: "Hace 1 día",
                    donationImage: "https://cdn2.cocinadelirante.com/sites/default/files/styles/gallerie/public/consejos-para-elegir-sabanas-rapidos.jpg",
                    donationPath: "/",
                    ownerImage: "http://localhost:2004/images/profileImages/3.jpg",
                    title: "Cuna para bebé"
                },

                {
                    date: "Hace 1 día",
                    donationImage: "data:image/jpeg;base64,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",
                    donationPath: "/",
                    ownerImage: "http://localhost:2004/images/profileImages/4.jpg",
                    title: "Cuna para bebé"
                }
            ])

        }, 5000);
        });



    }


}