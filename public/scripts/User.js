import { Session } from "./Session.js";

export class User{

    constructor({userId, name, profileImage}){
        this.userId = userId;
        this.name = name;
        this.profileImage = profileImage;
    }

    static getUserData(userId){

        return new Promise((resolve, reject) => {

            resolve({
                profileImage:"images/profileImages/1.jpg",
                name:"Diego Morales"
            })
        });

    }

    static createNewUser({dpi, username, email, password, name, lastname, address, sex, birthday, profilePic, documentsPics}){

        return new Promise((resolve, reject) =>{

            const form = new FormData();

            //agregar foto de perfil
            documentsPics.unshift(profilePic);

            for (let file of documentsPics){
                form.append('files[]', file, file.name)
            }

            let reqObject;
            form.append("dpi", dpi);
            form.append("username", username);
            form.append("email", email);
            form.append("password", password);
            form.append("name", name);
            form.append("lastname", lastname);
            form.append("address", address);
            form.append("sex", sex);
            form.append("birth", birthday);

            
            const data = new URLSearchParams(form);

            fetch("/user/signIn", {
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


                    if (reqObject.ok === true){
                        Session.token = res.Token;
                        resolve();
                    }
                    else{ 

                        reject();
                    }
                })
                .catch(err => reject());
        });

    }

    
}