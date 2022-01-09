var express = require('express')
var multer  = require('multer')
const firebase = require("./firebase_init")
const csv = require('csv-parser')
const bcrypt = require("bcryptjs");
var fs = require('fs');

var upload = multer({ dest: 'uploads/' })

var app = express()

async function func(){
    await new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log("Hello world");
            resolve("Done");
        }, 5000);
    })
    const salt = await bcrypt.genSalt(8);
    var a = await bcrypt.hash("asdf1234",salt);
    console.log(a);
}
// func();
app.get("/",(req,res)=>{

    firebase.auth().importUsers(
        [
          {
            uid: 'uid1',
            email: 'user1@gmail.com',
            // Must be provided in a byte buffer.
            passwordHash: Buffer.from('$2a$04$6GpK9CnjYNDizVBI/blFSuFIS4R3S9WWt9KxEFBaXhOJ8jzKUdy1q'),
          },
        ],
        {
          hash: {
            algorithm: 'BCRYPT',
          },
        }
      )
      .then((results) => {
        results.errors.forEach((indexedError) => {
          console.log(`Error importing user ${indexedError.index}`);
        });
      })
      .catch((error) => {
        console.log('Error importing users :', error);
      });

    res.send();
});


app.post('/upload', upload.single("csv"), async function (req,res,next) {

    await new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log("Hello world");
            resolve("Done");
        }, 1000);
    })

    var file = req.file;
    console.log(`FILE : ${req.file.path}`);
    if (!file) {      
        const error = new Error('Please upload a file')      
        error.httpStatusCode = 400      
        return next(`Error : ${error}`);  
    }  
    
    console.log("Received file : " + req.file);
    var src = fs.createReadStream(req.file.path);
    var dest = fs.createWriteStream('uploads/' + req.file.originalname);
    src.pipe(dest);
    src.on('end', async function() {
        fs.createReadStream('uploads/' + req.file.originalname)
            .pipe(csv())
            .on('data', function (row) {
                console.log(row);
                // const username = generateUsername(row.Firstname, row.Surname);
                // const password = randomWords(3).join("-");
                
                // const user = {
                //     username,
                //     firstname: row.Firstname,
                //     surname: row.Surname,
                //     roles: row.Roles,
                //     password
                // }
                // users.push(user)
            })
            .on('end', function () {
                fs.rmSync('uploads/' + req.file.originalname);
                fs.unlinkSync(req.file.path);
                // console.table(users)
            })
    	res.json('OK: received ' + req.file.originalname);
    });
    src.on('error', function(err) { res.json('Something went wrong!'); });
  
})


let port = process.env.PORT || 3000;
app.listen(port, function () {
    return console.log("Started file upload server on port " + port);
});
