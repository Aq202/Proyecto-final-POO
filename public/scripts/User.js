export class User{

    constructor({userId, email, name, lastName, birthday, sex, imageUrl}){
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.lastName = lastName;
        this.birthday = birthday;
        this.sex = sex;
        this.imageUrl = imageUrl;
    }

    static getUser({user, email, password}){

        return new Promise((resolve, reject) =>{

            let data = {
                username:user,
                email:email,
                password
            }

            fetch("http://localhost:2004/user/login",{
                method:"POST",
                body:JSON.stringify(data),
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(r => r.json())
            .then(result =>{
                console.log(result)
                try{
                    //almacenar datos
                    if(result.hasOwnProperty("Token")){
                        localStorage.setItem("sessionToken", result.Token)
                        delete result.Token;
                    }else{
                        reject("No token");
                    }

                    localStorage.setItem("userData", JSON.stringify(result));

                    resolve();
            
                }catch(ex){
                    reject(ex);
                }

                

            }).catch(err => reject(err))
        });
    }

    static createNewUser({dpi, username, age, email, password, name, lastname, direction, sex, birtday}){

        return new Promise((resolve, reject) =>{

            let data = {
                dpi,
                username,
                age,
                email,
                password,
                name, 
                lastname, 
                direction,
                sex, 
                birth:birtday
            }

            fetch("http://localhost:2004/user/signIn",{
                method:"POST",
                body:JSON.stringify(data),
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(r => r.json())
            .then(result =>{
                console.log(result)
               
                    resolve();
            
            }).catch(err => reject(err))
        });

    }

}