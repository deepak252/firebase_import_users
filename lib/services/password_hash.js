const bcrypt = require("bcryptjs");

module.exports =  function passwordHash(password){
    return new Promise(async (resolve,reject) =>{
        const salt = await bcrypt.genSalt(8);
        var hash = await bcrypt.hash("asdf1234",salt);
        resolve(hash);
        reject("Something went wrong");
    });  
}