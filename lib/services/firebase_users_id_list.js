const firebase = require("../config/firebase_init")
// Import uers to firebase auth
module.exports = function firebaseUsersIdList(users){     ///users = List of UserImportRecord
    return new Promise(async (resolve,reject)=>{
        let userLists = await firebase.auth().listUsers();
        resolve(userLists.users.map((userRecord)=>userRecord.uid));
        reject("firebaseUsersList error : Something went wrong");
    });
}