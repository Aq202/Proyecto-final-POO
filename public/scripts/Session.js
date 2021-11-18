import parseJwt from "../helpers/parseJwt.js";

export class Session {

    constructor({ userId, email, name, lastName, birthday, sex, imageUrl }) {
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.lastName = lastName;
        this.birthday = birthday;
        this.sex = sex;
        this.imageUrl = imageUrl;

    }

    static _inSession = false;

    static async login({ user, email, password }) {

        const token = localStorage.getItem("sessionToken") || false;
        const userData = sessionStorage.getItem("userData") || false;

        if (token === false && userData === false) {

            const result = await this.authenticateUser({ user, email, password });
            this.sendSessionEvent();

        } else if (token !== false && userData === false) {

            try {
                await this.restoreSessionByToken(token);
                this.sendSessionEvent();
            } catch (ex) {

            }

        }



    }

    static authenticateUser({ user, email, password }) {

        return new Promise((resolve, reject) => {

            let data = {
                username: user,
                email: email,
                password
            }


            fetch("/user/login", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(r => {
                if (r.ok === false) throw "";
                return r.json();
            })
                .then(result => {

                    try {
                        //almacenar datos
                        if (result.hasOwnProperty("Token")) {
                            Session.token = result.Token;
                            delete result.Token;

                        } else {
                            reject("No token");
                            return
                        }

                        sessionStorage.setItem("userData", JSON.stringify(result));

                        resolve();
        
                    } catch (ex) {
                        reject(ex);
                    }

                }).catch(err => {
                    reject(err)
                })
        });

    }

    static restoreSessionByToken() {

        if (Session.userInSession) return;
        if (Session.token === undefined) return;

        const tokenObj = parseJwt(Session.token);
        if (tokenObj !== null) {

            const { age, bith, dpi, email, sub, lastname, name, sex, username } = tokenObj;

            const sessionObj = {
                Age: age,
                Birth: bith,
                DPI: dpi,
                Email: email,
                Id: sub,
                Lastname: lastname,
                Name: name,
                Sex: sex,
                Username: username
            }

            sessionStorage.setItem("userData", JSON.stringify(sessionObj));
            Session.sendSessionEvent();
            Session._inSession = true;
        } else {
            Session.logout();
        }

    }




    static logout() {
        sessionStorage.removeItem("userData");
        localStorage.removeItem("sessionToken");
        this.sendSessionEvent();
        Session._inSession = false;
    }

    static sendSessionEvent() {
        const sessionEvent = new CustomEvent("sessionStateChanged");
        document.dispatchEvent(sessionEvent);
    }

    static get userData() {

        const dataJSON = sessionStorage.getItem("userData");
        if (dataJSON === undefined || dataJSON === null) return undefined;
        return JSON.parse(dataJSON);
    }

    static get token() {

        const token = localStorage.getItem("sessionToken");
        if (token === null) return undefined;
        return token;
    }

    static set token(token) {
        try {
            if (token !== undefined && token !== null && token.trim() != "") {
                localStorage.setItem("sessionToken", token);
                Session._inSession = true;

            }
        } catch (ex) {

        }

    }

    static verifyToken() {
        if (Session.token === undefined) sessionStorage.clear();
    }

    static get userInSession() {
        Session.verifyToken();
        return (Session.userData !== undefined && Session.userData !== null);
    }

    /**
     * Verifica si no se ha actualizado el estado de la sesión.
     */
    static updateSessionState() {
        if (Session.userInSession !== Session._inSession) {
            Session._inSession = Session.userInSession;
            this.sendSessionEvent();
        }
    }


    static get id() {

        const userData = Session.userData;

        if (userData === undefined) return;
        if (userData.hasOwnProperty("Id")) return userData.Id;
    }

    static get age() {

        const userData = Session.userData;

        if (userData === undefined) return;
        if (userData.hasOwnProperty("Age")) return userData.Age;
    }

    static get birth() {

        const userData = Session.userData;

        if (userData === undefined) return;
        if (userData.hasOwnProperty("Birth")) return userData.Birth;
    }

    static get dpi() {

        const userData = Session.userData;

        if (userData === undefined) return;
        if (userData.hasOwnProperty("DPI")) return userData.DPI;
    }

    static get email() {

        const userData = Session.userData;

        if (userData === undefined) return;
        if (userData.hasOwnProperty("Email")) return userData.Email;
    }

    static get username() {

        const userData = Session.userData;

        if (userData === undefined) return;
        if (userData.hasOwnProperty("Username")) return userData.Username;
    }

    static get lastName() {

        const userData = Session.userData;

        if (userData === undefined) return;
        if (userData.hasOwnProperty("Lastname")) return userData.Lastname;
    }

    static get firstName() {

        const userData = Session.userData;

        if (userData === undefined) return;
        if (userData.hasOwnProperty("Name")) return userData.Name;
    }

    static get name() {

        const name = Session.firstName + " " + Session.lastName;
        return name;
    }

    static get profileImage() {

        return Session.userData?.profilePic;
    }

}