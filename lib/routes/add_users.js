const express = require("express");
const csv = require('csv-parser');
var fs = require('fs');
var multer  = require('multer');

const router = express.Router();

var upload = multer({ dest: 'uploads/' });


router.post('/upload', upload.single("csv"), async function (req,res,next) {

    // await new Promise((resolve,reject)=>{
    //     setTimeout(() => {
    //         console.log("Hello world");
    //         resolve("Done");
    //     }, 1000);
    // })

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

module.exports = router;