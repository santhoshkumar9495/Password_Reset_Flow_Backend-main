const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const dotenv = require("dotenv");
const {
    getallusers,
    isEmailexist,
    insertUser,
    isUserexist,
    getUserByUsername,
    Edituserprofile
  }=require("../model/User.models");
const {verifyUser}=require("../middleware/user.verification");
const {userAuthorization} =require("../middleware/Authorization");
const {registerMail}=require("../controllers/mailer.js");


dotenv.config();

/**GET Methods */
//get all users
router.get("/allusers", async (req, res, next) => {
    try {
      const response = await getallusers();
      if (response.length > 0) {
        return res.status(200).send(response);
      } else {
        return res.status(500).json({
          success: false,
          message: "Users not found!!!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error,
        message: "Internal server error!!!",
      });
    }
  });

  //get user profile
  router.get("/user/:username", async (req,res)=>{  
    const { username } = req.params;
    try {
        if(!username) return res.status(501).send({ error: "Invalid Username"});
        const user = await getUserByUsername(username);
        if (!user) {
          return res.status(501).send({ error : "Couldn't Find User"});
          }
          const { password, ...rest } = Object.assign({}, user.toJSON());
          return res.status(201).send(rest);
    } catch (error) {
        return res.status(404).send({ error : "Cannot Find User Data"});
    }

});

/** POST Methods */
//create new user
router.post("/register", async function (req, res, next) {
    const { username, password, profile, email } = req.body;  
    const isUseremailExist = await isEmailexist(email);
    const isuserusernameExists=await isUserexist(username);
    if (isUseremailExist) {
      res.status(404).send({ msg: "Email id already Exist cannot sign in with the same Email id"});
      return;
    }
    if (isuserusernameExists) {
        res.status(404).send({ msg: "Username Already Exists Sign in with different username"});
        return;
      }
    if (!/^(?=.*?[0-9])(?=.*?[a-z]).{8,}$/g.test(password)) {
      res.status(400).send({ msg: "Password pattern doesn't match"});
      return;
    }
    try {
        const salt = await bcrypt.genSalt(8); //bcrypt.genSalt(no. of rounds)
        const hashedPassword = await bcrypt.hash(password, salt);
      const newUserObj = { username, password:hashedPassword, profile:profile|| "", email };
      const result = await insertUser(newUserObj);
      if (result?._id) {
        return res.status(201).send({ msg: "User Registered Successfully"});
      } else {
        return res.status(400).send({ msg: "User Registeration Failed"})
      }
    } catch (error) {
      // console.log(error);
      return res.status(500).send(error);
    }
  });

  // user  Sign In
  router.post("/login",verifyUser, async (req, res) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        return res.json({status: "error", success: false, message: "Invalid Sign in" });
      }
      const user = await getUserByUsername(username);
      if (!user) {
        return res.status(404).send({ error : "Username not Found"});
      }
      const storedDbPassword = user.password;
      const isPasswordMatch = await bcrypt.compare(password, storedDbPassword);
      if (!isPasswordMatch) {
        return res.status(400).send({ error: "Password does not Match"})
      }
      const token = await jwt.sign({
        userId: user._id,
        username : user.username,
        userEmail:user.email,
    }, process.env.JWT_SECRET , { expiresIn : "2h"});  
    res.status(200).send({
      msg: "Login Successful..!",
      username: user.username,
      userEmail:user.email,
      token
  });    
    } catch (error) {
      return res.status(500).send({ error});
    }
  });

  /**Edit user Profile */
  router.put("/edituser",userAuthorization, async (req, res) =>{
    try {
        
        // const id = req.query.id;
        const { userId } = req.user;

        if(userId){
            const update = req.body;

            // update the data
            const result= await Edituserprofile(userId,update);
   if (result._id) {
    return res.status(201).send({ msg : "Records Updated...!"});
  }
        }else{
          return res.status(401).send({ error : "User update Failed"});
        }

    } catch (error) {
      return res.status(401).send({ error });
    }
});

router.post('/authenticate',verifyUser, (req, res) =>{ res.end()}); // authenticate user

router.route('/registerMail').post(registerMail);




module.exports = router;