export class RandomFunctions{

    static getRandomNumber(min, max){
        return Math.round(Math.random() * (max - min) + min);
    }
    
    static getRandomString(long){
    
        const chars = "abcdefghijklmnopqrstuvwxyz1234567890"
        let result = ""
    
        for(let i = 0; i < long; i++){
    
            //se selecciona un caracter del grupo
            let selectedChar = chars[RandomFunctions.getRandomNumber(0, chars.length - 1)]
    
            //se decide si mayuscula o minuscula
            let number = RandomFunctions.getRandomNumber(0,1)
            if(number == 1){
                result += selectedChar.toUpperCase()
            }else{
                result += selectedChar
            }
    
        }
    
        return result
    }
}