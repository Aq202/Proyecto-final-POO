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

    static login({user, email, password}){


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
            }).then(r =>{ 
                if(r.ok === false) throw "";
                return r.json();
            })
            .then(result =>{

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

                

            }).catch(err =>{                 
                reject(err)})
        });
    }

    static logout(){
        localStorage.removeItem("userData");
        localStorage.removeItem("sessionToken");
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

    static get userData(){

        const dataJSON = localStorage.getItem("userData");
        if(dataJSON === undefined || dataJSON === null) return undefined;

        return JSON.parse(dataJSON);
    }

    static get userInSession(){
        return (User.userData !== undefined && User.userData !== null);
    }


    static get id(){
        
        const userData = User.userData;

        if(userData === undefined) return;
        if(userData.hasOwnProperty("ID")) return userData.ID;
    }

    static get age(){
        
        const userData = User.userData;

        if(userData === undefined) return;
        if(userData.hasOwnProperty("Age")) return userData.Age;
    }

    static get birth(){
        
        const userData = User.userData;

        if(userData === undefined) return;
        if(userData.hasOwnProperty("Birth")) return userData.Birth;
    }

    static get dpi(){
        
        const userData = User.userData;

        if(userData === undefined) return;
        if(userData.hasOwnProperty("DPI")) return userData.DPI;
    }

    static get email(){
        
        const userData = User.userData;

        if(userData === undefined) return;
        if(userData.hasOwnProperty("Email")) return userData.Email;
    }

    static get username(){
        
        const userData = User.userData;

        if(userData === undefined) return;
        if(userData.hasOwnProperty("Username")) return userData.Username;
    }

    static get lastName(){
        
        const userData = User.userData;

        if(userData === undefined) return;
        if(userData.hasOwnProperty("Lastname")) return userData.Lastname;
    }

    static get firstName(){
        
        const userData = User.userData;
        
        if(userData === undefined) return;
        if(userData.hasOwnProperty("Name")) return userData.Name;
    }

    static get name(){
        
        const name = User.firstName + " " + User.lastName;
        return name;
    }
    
}