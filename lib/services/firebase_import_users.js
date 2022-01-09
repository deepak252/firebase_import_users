const firebase = require("../config/firebase_init")

module.exports = function firebaseImportUsers(users){     ///users = List of UserImportRecord
    return new Promise((resolve,reject)=>{
        firebase.auth().importUsers(
            users,{
              hash: {
                algorithm: 'BCRYPT',
              },
            })
            .then((results) => {
                results.errors.forEach((indexedError) => {
                console.log(`Error importing user ${indexedError.index}`);
                });
                resolve("Users Import Successful")
            })
            .catch((error) => {
                console.log('Error importing users :', error);
                reject('Error importing users :', error);
            });
    });
}