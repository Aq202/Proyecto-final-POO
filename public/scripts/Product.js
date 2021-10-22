import { User } from "./User.js";

export class Product {

    static createNewProduct({ name, category, department, municipality, description }) {

        return new Promise((resolve, reject) => {

            if(!User.userInSession) reject();

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
                    'Authorization': User.token, 
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
   


}