import { Session } from "./Session.js";

export class Product {

    static createNewProduct({ name, cathegory, department, municipality, description, images }) {

        return new Promise((resolve, reject) => {

            if (!Session.userInSession) reject();

            const form = new FormData();

            for (let file of images) {
                form.append('files[]', file, file.name);
            }

            let reqObject;
            form.append("name", name);
            form.append("cathegory", cathegory);
            form.append("department", department);
            form.append("municipality", municipality);
            form.append("description", description);


            fetch("/product/addProduct", {
                method: "POST",
                body: form,
                headers: {
                    'Authorization': Session.token,
                }
            })
                .then(r => {
                    reqObject = r;
                    return r.json();
                })
                .then(res => {

                    if (reqObject.ok === true) resolve(res);
                    else reject(res);
                })
                .catch(err => reject(err));

        });

    }

    static getProductData(productId) {

        return new Promise((resolve, reject) => {
            resolve({
                productId: "asdfñkl",
                cathegory: "Tecnología",
                municipality: "Villa Nueva",
                title: "Cámara nueva canon",
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia soluta eius commodi aut ducimus reiciendis voluptatem laudantium dolorum? Aperiam eius maxime, quaerat tempore fuga esse alias consequatur quis explicabo quam.",
                profileImage: "images/profileImages/1.jpg",
                name: "Diego Morales",
                productImages: [
                    "http://cdn.shopify.com/s/files/1/0101/2522/files/dslr-manual-focus_grande.jpg?3541",
                    "https://www.geovirtual2.cl/Entrada/Camara-Pentax-2015-01n.jpg",
                    "https://mott.pe/noticias/wp-content/uploads/2017/09/Las-5-mejores-c%C3%A1maras-de-fotos-compactas-usadas-por-fot%C3%B3grafos-profesionales-1280x720.jpg"
                ]

            })
        })
    }

    static newRequestOfDonation({ user, productId }) {

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                resolve();
            }, 5000);
        })
    }

    static deleteProduct(productId) {

        return new Promise((resolve, reject) => {

            if (productId === undefined || productId === null) reject("Id invalido.");

            setTimeout(() => {
                resolve();
            }, 3000);
        })
    }


    static getProducts({ skip, quantity,  department, municipality, search, category }) {



        return new Promise((resolve, reject) => {


            const props = {
                skip,
                quantity,
                ascending:true,
                department,
                municipality,
                search,
                cathegory:category
            }

            if(skip === undefined) delete props.skip;
            if(quantity === undefined) delete props.quantity;
            if(department === undefined) delete props.department;
            if(municipality === undefined) delete props.municipality;
            if(search === undefined) delete props.search;
            if(category === undefined) delete props.cathegory;

            console.log(props)

            let reqObject;
            fetch("/product/filteredSearch", {
                method: "POST",
                body: JSON.stringify(props),
                headers: {
                    'Authorization': Session.token,
                    "Content-Type": "application/json"
                }
            })
            .then(r => {
                console.log(r)
                reqObject = r;
                return r.json();
            })
            .then(result => {

                if(reqObject.ok === true){
                    resolve(result.products)
                }else{
                    console.log("heeey")
                    reject();
                }

            }).catch(e => reject());



        })
    }


}