var express = require('express')
// const firebase = require("./config/firebase_init")
// const getPasswordHash = require('./services/password_hash');
// const importUsersToFirebase = require('./services/firebase_import_users');

let port = process.env.PORT || 3000;

var app = express();

app.use("/api/v2/users", require("./routes/users"));

// var a = getPasswordHash((123223).toString()).then((value)=>console.log(value));
// console.log(a);

app.listen(port, function () {
    return console.log("Started csv file upload server on port " + port);
});




// [
//     {
//       uid: 'uid1',
//       email: 'user1@gmail.com',
//       // Must be provided in a byte buffer.
//       passwordHash: Buffer.from('$2a$04$6GpK9CnjYNDizVBI/blFSuFIS4R3S9WWt9KxEFBaXhOJ8jzKUdy1q'),
//     },
//   ]