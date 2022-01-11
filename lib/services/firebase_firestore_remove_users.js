const firebase = require("../config/firebase_init")
// Remove users from firebase firestore
module.exports = function firebaseFirestoreRemoveUsers(uids){     ///uids = List of users ids
    return new Promise(async (resolve,reject)=>{
        // Batch operation for firestore users collection
        let usersWritebatch = firebase.firestore().batch();
        uids.forEach(async (uid)=>{
            // console.log(user);
            let documentRef = firebase.firestore().doc(`users/${uid}`);
            usersWritebatch.delete(documentRef);
            
        });
        // Commit users data to users collections
        await usersWritebatch.commit()
            .then((value)=>{
                console.log("Users removed from firestore, users collection updated");
                resolve(true);
            })
            .catch((error)=>{
                console.log("firebaseFirestoreRemoveUsers operation error", error);
                reject(false);
            });
    });
}