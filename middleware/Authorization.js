const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();


const userAuthorization = async (req, res, next) => {
    try {
        // access authorize header to validate request
        const token = req.headers.authorization;
        // retrive the user details fo the logged in user
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next()
    } catch (error) {
        res.status(401).json({ error : "Authentication Failed!"})
    }
  };
  

  const localVariables=(req, res, next)=>{
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next();
}



  module.exports = {
    userAuthorization,
    localVariables,
  };