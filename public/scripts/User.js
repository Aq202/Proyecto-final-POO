import { Session } from "./Session.js";

export class User {

    constructor({ userId, name, profileImage }) {
        this.userId = userId;
        this.name = name;
        this.profileImage = profileImage;
    }


    static createNewUser({ dpi, username, email, password, name, lastname, address, sex, birthday, profilePic, documentsPics }) {

        return new Promise((resolve, reject) => {

            const form = new FormData();

            //agregar foto de perfil
            documentsPics.unshift(profilePic);

            for (let file of documentsPics) {
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

                    console.log(res)

                    if (reqObject.ok === true) {
                        Session.token = res.Token;
                        resolve();
                    } else {
                        reject(res.message);
                    }

                })
                .catch(err => reject());
        });

    }

    static getProfileData(userId) {

        return new Promise((resolve, reject) => {

            const obj = {
                userId
            }

            let reqObj;

            fetch("/product/getProfileData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Session.token
                },
                body: JSON.stringify(obj)
            })
                .then(r => {
                    reqObj = r;
                    return r.json();
                })
                .then(result => {

                    console.log(result)
                    if (reqObj.ok === true) {
                        resolve({
                            userName: result.name,
                            userAlias: result.username,
                            profilePicture: result.profilePic,
                            donationsMade: result.donations,
                            donationsReceived: result.adquisitions
                        })
                    } else {
                        reject(result.error)
                    }
                })
                .catch(err => reject(err));

        });
    }


}