const express = require("express");
const csv = require('csv-parser');
var fs = require('fs');
var multer  = require('multer');
const verifyAdmin = require("../middleware/verify_admin");
const firebase = require("../config/firebase_init")
const firebaseAuthImportUsers = require('../services/firebase_auth_import_users');
const firebaseFirestoreAddUsers = require("../services/firebase_firestore_add_users");
const firebaseFirestoreRemoveUsers = require("../services/firebase_firestore_remove_users");
const getPasswordHash = require('../services/password_hash');
const firebaseUsersIdList = require("../services/firebase_users_id_list");
const existingUsersEmailList = require("../services/existing_users_email_list");


const router = express.Router();

var upload = multer({ dest: 'uploads/' });

//Fetch all users from firebase
// DELETE : http://localhost:3000/api/v2/users/getUsers/
router.get("/getUsers",verifyAdmin,async (req,res)=>{
    let  users = await firebase.auth().listUsers();   
    console.log(users); 
    let querySnapshot = await firebase.firestore().collection("users").get();
    let data =[];
    querySnapshot.forEach((doc)=>{
        // console.log(doc.data());
        data.push(doc.data());
    });
    res.status(200).json(data);
    res.send();
});

//Upload users csv to firebase auth(import user data in firebase auth)
// POST: http://localhost:3000/api/v2/users/upload/
router.post('/uploadUsers' ,verifyAdmin, upload.single("csv"), async function (req,res,next) {
    try{
        let receivedFile = req.file;
        console.log(`FILE : ${receivedFile.path}`);
        if (!receivedFile) {      
            const error = new Error('Please upload a file')      
            error.httpStatusCode = 400      
            return next(`Error : ${error}`);  
        }  
        
        let src = fs.createReadStream(receivedFile.path);
        let dest = fs.createWriteStream('uploads/' + receivedFile.originalname);
        src.pipe(dest);
        
        let usersCsvData=[];

        src.on('end', async function() {
            fs.createReadStream('uploads/' + receivedFile.originalname)
                .pipe(csv())
                .on('data', function (row) {
                    // console.log(row);
                    usersCsvData.push({
                        "email": row.email,
                        "phone": row.phone
                    });
                })
                .on('end',async  function () {
                    // console.log(usersCsvData);
                    fs.rmSync('uploads/' + receivedFile.originalname);
                    fs.unlinkSync(receivedFile.path);

                    //Fetch all existing emails from firebase auth
                    let existingEmails = await existingUsersEmailList();
                    // console.log("existingEmails  " ,existingEmails);

                    let users = [];
                    users = await Promise.all(
                        usersCsvData.map(async (data)=>{
                            let encrptPswd = await getPasswordHash(data.phone)
                            let randomDocId = firebase.firestore().collection('temp').doc().id;
                            return {
                                uid: randomDocId,
                                email: data.email,
                                passwordHash: Buffer.from(encrptPswd)
                            };
                    }));

                    //Now remove already existing emails(users) from users list
                    users = users.filter(user=>{
                        return existingEmails.indexOf(user.email) < 0; // index>-1 means, email already exists
                    });

                    console.log("Importing users to firebase...: ");
                    
                    var result = await firebaseAuthImportUsers(users);
                    if(result.status==true){
                        // console.log("importing users : ", users);
                        console.log("result = ",result);
                        console.log("Removing unsuccessful imports from users list..");
                        result.unsuccessfulIndexes.reverse().forEach((index)=>{
                            users.splice(index,1);
                        });
                        console.log("Successfully imported users : ", users.map((user)=>user.email));
                        // Add all users to firestore users collection
                        await  firebaseFirestoreAddUsers(users);
                        
                    }else{
                        console.log("User import unsuccessful");
                        console.log("result = ",result);
                    }
                })
            res.json('OK: received ' + receivedFile.originalname);
        });
        src.on('error', function(err) { res.json('Something went wrong!'); });
    }catch(e){
        console.log("uploadUsers error: ",e);
    }
  
})

// Delete users from firebase auth
// DELETE : http://localhost:3000/api/v2/users/deleteUsers/
router.delete("/deleteUsers",verifyAdmin, async (req,res)=>{

    // var a = await firebase.auth().getUserByEmail("user1@gmail.com");

    
    let uids = await firebaseUsersIdList(); // get all user Ids from firebase auth
    console.log(uids);

    await firebase.auth().deleteUsers(uids); //Delete all users from firebase Auth
    await firebaseFirestoreRemoveUsers(uids);
    res.json("Users deleted successfully");               
    res.end();
})

module.exports = router;