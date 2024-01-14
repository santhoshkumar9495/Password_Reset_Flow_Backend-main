const bcrypt = require("bcrypt");

async function genPassword(password) {
    const salt = await bcrypt.genSalt(8); //bcrypt.genSalt(no. of rounds)
    // console.log(salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(hashedPassword);
    return hashedPassword;
  }

  module.exports = genPassword;