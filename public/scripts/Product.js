
export class Product {

    static createNewProduct({ name, category, department, municipality, description }) {

        return new Promise((resolve, reject) => {

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
                    "Content-Type": "application/json"
                }
            })
                .then(r => {
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