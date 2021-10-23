import { User } from "./User.js";

export class Product {

    static createNewProduct({ name, cathegory, department, municipality, description, images }) {

        return new Promise((resolve, reject) => {

            if(!User.userInSession) reject("No hay un usuario en sesión.");

            const form = new FormData();

            for(let file of images){
                    form.append('files[]', file, file.name);      
            }

            form.append("name",name);
            form.append("cathegory",cathegory);
            form.append("department",department);
            form.append("municipality",municipality);
            form.append("description",description);
            
            let status;

            fetch("/product/addProduct", {
                method: "POST",
                body: form,
                headers: {
                    'Authorization': User.token, 
                }
            })
                .then(r => {
                    status = r.ok;
                    return r.json();
                })
                .then(res => {
                    if(status === true) resolve(res.message);
                    else reject(res.message);
                })
                .catch(err => reject(err));
                
            });

            

        }
   


}