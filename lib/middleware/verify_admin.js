const firebase = require("../config/firebase_init")
/// Restrict access to admin (admin "userId" is required in POST request Header)
const verifyAdmin = async (req,res,next) =>{
    
    const userId = req.header("userId");
    console.log(userId);
    if(!userId){
        res.status(401).json({error: "User not allowed, 'userId' header required (eg. userId : <admin uid>)"});
    }
    try{
        var doc = await firebase.firestore().collection("users").doc(userId).get();
        if(doc!=null && doc.data()!=null && (doc.data().userType.toString())=="admin"){
            res.status(200).json({ status: "User allowed" });
            next();
        }else{
            res.status(401).json({ error: "User not allowed" });
        }
    }catch(error){
        res.status(401).json({ error: "User not allowed: "+error });
    }
}

module.exports = verifyAdmin;
