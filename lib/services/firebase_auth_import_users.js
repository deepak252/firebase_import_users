const firebase = require("../config/firebase_init")
// Import uers to firebase auth
module.exports = function firebaseAuthImportUsers(users){     ///users = List of UserImportRecord
    return new Promise((resolve,reject)=>{
      var unsuccessfulIndexes = [];
      firebase.auth().importUsers(
        users,{
          hash: {
            algorithm: 'BCRYPT',
          },
        })
        .then((results) => {
          // console.log(results);
            results.errors.forEach((indexedError) => {
              unsuccessfulIndexes.push(indexedError.index);
              // console.log(`Error importing user ${indexedError.index} : ${indexedError.error} `);
            });
            resolve({
              "status" : true,
              "unsuccessfulIndexes": unsuccessfulIndexes
            });
        })
        .catch((error) => {
            console.log('Error importing users :', error);
            reject({
              "status" : false,
            });
        });
    });
}