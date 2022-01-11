const bcrypt = require("bcryptjs");

module.exports =  function passwordHash(password){
    return new Promise(async (resolve,reject) =>{
        const salt = await bcrypt.genSalt(8);
        let hash = await bcrypt.hash(password,salt);
        resolve(hash);
        reject("passwordHash error : Something went wrong");
    });  
}