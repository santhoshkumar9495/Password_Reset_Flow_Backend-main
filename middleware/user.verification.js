const {getUserByUsername} = require("../model/User.models");


const verifyUser=async(req, res, next)=>{
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        let exist = await getUserByUsername(username);
        if(!exist) return res.status(404).send({ error : "User doesnot exist"});
        next();
    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}


module.exports = {verifyUser};