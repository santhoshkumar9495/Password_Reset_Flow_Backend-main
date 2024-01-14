const mongoose=require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
function Connectnodetodb(){
    mongoose.connect(process.env.MONGODB_URL, { useUnifiedTopology: true, useNewUrlParser: true }).then((response) => {
        console.log("Mongodb Connection Successful");
      }).catch((error)=>{
        console.log("Mongodb Connection Failed",error);
    });
}
Connectnodetodb();
module.exports = mongoose;

