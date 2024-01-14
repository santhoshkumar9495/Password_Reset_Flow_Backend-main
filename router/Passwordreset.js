const otprouter = require("express").Router();
const otpGenerator =require("otp-generator");
const bcrypt = require("bcrypt");
const {localVariables} = require("../middleware/Authorization");
const {verifyUser} = require("../middleware/user.verification");
const {updatePassword,isUserexist}=require("../model/User.models");


  /** GET: http://localhost:8000/api/otp/generateOTP */
  otprouter.get("/generateOTP",verifyUser,localVariables, async (req, res, next) => {
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
});


/** GET: http://localhost:8000/api/otp/verifyOTP */
otprouter.get("/verifyOTP",verifyUser, async (req, res, next) => {
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verified Successsfully!'});
    }
    return res.status(400).send({ error: "Invalid OTP"});
});

/** GET: http://localhost:8000/api/otp/createResetSession */
otprouter.get("/createResetSession",verifyUser, async (req, res, next) => {
    if(req.app.locals.resetSession){
         return res.status(201).send({ flag : req.app.locals.resetSession})
    }
    return res.status(440).send({error : "Session expired!"});
 });

//  /** GET: http://localhost:8000/api/otp/reset-password */
 otprouter.put("/reset-password",verifyUser,  async (req, res) => {
    try {
        
        if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});
        const { username, password } = req.body;
    try {
      //Encrypt the new password

      const salt = await bcrypt.genSalt(8); //bcrypt.genSalt(no. of rounds)
        const hashedPassword = await bcrypt.hash(password, salt);
      const user = await updatePassword(username,hashedPassword);
      if (user._id) {
        req.app.locals.resetSession = false; // reset session
        return res.status(201).send({ msg : "Password Recovered Successfully"})
      }else{
        res.status(500).send({
          error : "Unable to Reset the password"
      })
        }
    } catch (error) {
      return res.status(500).send({ error })
        } 
    }catch (error) {
            return res.status(401).send({ error })
        }
  });




module.exports = otprouter;