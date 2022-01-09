var express = require('express')
const firebase = require("./config/firebase_init")
const getPasswordHash = require('./services/password_hash');
const firebaseImportUsers = require('./services/firebase_import_users');

let port = process.env.PORT || 3000;

var app = express();
app.use("/addUsers", require("./routes/add_users"));

// var a = passwordHash("Hello").then((value)=>console.log(value));

var usersData = Array(2).fill({
    uid: 'uid1',
    email: 'user1@gmail.com',
    password: "asdf1234"
})


app.get("/",async (req,res)=>{

    let users = await Promise.all(usersData.map(async (data)=>{
        let encrptPswd = await getPasswordHash(data.password)
        let randomDocId = firebase.firestore().collection('temp').doc().id;
        return {
            uid: "deepak@gmail.com",
            email: data.email,
            passwordHash: Buffer.from(encrptPswd)
        };
    }));
    console.log(users);


    await firebaseImportUsers(users)

    var a = await firebase.auth().listUsers()
    console.log(a);

    res.send();
});


app.listen(port, function () {
    return console.log("Started csv file upload server on port " + port);
});



// passwordHash: Buffer.from('$2a$04$6GpK9CnjYNDizVBI/blFSuFIS4R3S9WWt9KxEFBaXhOJ8jzKUdy1q'),


// [
//     {
//       uid: 'uid1',
//       email: 'user1@gmail.com',
//       // Must be provided in a byte buffer.
//       passwordHash: Buffer.from('$2a$04$6GpK9CnjYNDizVBI/blFSuFIS4R3S9WWt9KxEFBaXhOJ8jzKUdy1q'),
//     },
//   ]