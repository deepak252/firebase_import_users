const firebase = require("../config/firebase_init")
// Import users to firebase firestore
module.exports = function firebaseFirestoreAddUsers(users){     ///users = List of UserImportRecord
    return new Promise(async (resolve,reject)=>{
        // Batch operation for firestore users collection
        let usersWritebatch = firebase.firestore().batch();
        users.forEach(async (user)=>{
            // console.log(user);
            let documentRef = firebase.firestore().doc(`users/${user.uid}`);
            usersWritebatch.set(
                documentRef,
                user
            ,{merge:true});
        });
        // Commit users data to users collections
        await usersWritebatch.commit()
            .then((value)=>{
                console.log("Users added to firestore, users collection updated");
                resolve(true);
            })
            .catch((error)=>{
                console.log("firebaseFirestoreAddUsers operation error", error);
                reject(false);
            });
    });
}