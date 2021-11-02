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

            fetch("/product/addProduct", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                    'Authorization': Session.token,
                    "Content-Type": "application/json"
                }
            })
                .then(r => {
                    console.log(r)
                    if (r.ok !== true) throw "";

                    return r.json();
                })
                .then(res => {

                    resolve(res);
                })
                .catch(err => reject(err));

        });

    }

    static getProductData(productId) {

        return new Promise((resolve, reject) => {
            resolve({
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



}