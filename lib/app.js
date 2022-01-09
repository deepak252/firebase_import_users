var express = require('express')
const firebase = require("./config/firebase_init")
const getPasswordHash = require('./services/password_hash');
const importUsersToFirebase = require('./services/firebase_import_users');
const verifyAdmin = require('./middleware/verify_admin');

let port = process.env.PORT || 3000;

var app = express();
app.use("/addUsers", require("./routes/add_users"));


var usersData = Array(2).fill({
    uid: 'uid1',
    email: 'user1@gmail.com',
    password: "asdf1234"
})

// verifyAdmin
app.post("/",verifyAdmin,async (req,res)=>{
    
    var querySnapshost = await firebase.firestore().collection("users").get();
    querySnapshost.forEach((doc)=>{
        console.log(doc.data());
    });

    /////**Importing users to firebase auth */
    // let users = await Promise.all(usersData.map(async (data)=>{
    //     let encrptPswd = await getPasswordHash(data.password)
    //     let randomDocId = firebase.firestore().collection('temp').doc().id;
    //     return {
    //         uid: "deepak@gmail.com",
    //         email: data.email,
    //         passwordHash: Buffer.from(encrptPswd)
    //     };
    // }));
    // console.log(users);
    // await importUsersToFirebase(users)
    

    /////Fetching all athenticated users data
    // var a = await firebase.auth().listUsers()
    // firebase.auth().deleteUsers([

    // ])
    // console.log(a);

    res.send();
});


app.listen(port, function () {
    return console.log("Started csv file upload server on port " + port);
});


// var a = passwordHash("Hello").then((value)=>console.log(value));


// [
//     {
//       uid: 'uid1',
//       email: 'user1@gmail.com',
//       // Must be provided in a byte buffer.
//       passwordHash: Buffer.from('$2a$04$6GpK9CnjYNDizVBI/blFSuFIS4R3S9WWt9KxEFBaXhOJ8jzKUdy1q'),
//     },
//   ]