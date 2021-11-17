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

    static createNewUser({dpi, username, age, email, password, name, lastname, address, sex, birthday}){

        return new Promise((resolve, reject) =>{

            let data = {
                dpi,
                username,
                age,
                email,
                password,
                name, 
                lastname, 
                address,
                sex, 
                birth:birthday
            }

            fetch("http://localhost:2004/user/signIn",{
                method:"POST",
                body:JSON.stringify(data),
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(r => r.json())
            .then(result =>{
               
                    resolve();
            
            }).catch(err => reject(err))
        });

    }

    
}