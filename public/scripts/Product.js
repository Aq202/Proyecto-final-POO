import { Session } from "./Session.js";

export class Product {

    static createNewProduct({ name, cathegory, department, municipality, description, images }) {

        return new Promise((resolve, reject) => {

            if (!Session.userInSession) reject(new Error("Unauthorized"));

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

                    if (reqObject.ok === true) resolve(res.data);
                    else{ 

                        if(reqObject.status === 401){//unauthorized
                            Session.logout();
                            reject(new Error("Unauthorized"));
                            
                        }else{
                            reject()
                        }

                        
                    }
                })
                .catch(err => reject());

        });

    }

    /**
     * Retorna la información de un producto en específico.
     * @param {id del producto} productId 
     * @returns Promise. Resolve: productData.
     */
    static getProductData(productId) {

        return new Promise((resolve, reject) => {

            const obj = {
                productId
            }

            let reqObj;

            fetch("/product/getProduct", {
                method:"POST",
                body:JSON.stringify(obj),
                headers:{
                    'Authorization': Session.token,
                    "Content-Type": "application/json"
                }
            }).then(r => {
                reqObj = r;
                return r.json();

            }).then(result => {

                console.log("INFORMACION PRODUCTO, ", result)
                if(reqObj.ok === true){

                    

                    resolve({
                        productId: result.ProductFoundId,
                        cathegory: result.Cathegory,
                        department: result.Department,
                        municipality: result.Municipality,
                        title: result.ProductName,
                        description: result.ProductDescription,
                        profileImage: result.OwnerProfilePicture,
                        name: result.Owner,
                        productImages: result.Images,
                        donationReceivedConfirmed: result.donationReceivedConfirmed,
                        isOwner: result.isOwner,
                        alreadyRequested: result.alreadyRequested
        
                    })
                    
                }else{
                    reject();
                }

            }).catch(err => reject(err));

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
                reqObject = r;
                return r.json();
            })
            .then(result => {

                if(reqObject.ok === true){
                    resolve(result.products)
                }else{
                    reject();
                }

            }).catch(e => reject());



        })
    }


}