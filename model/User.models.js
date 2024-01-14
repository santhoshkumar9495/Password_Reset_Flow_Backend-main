const { UserSchema } = require("./User.Schema");

//To get all users
const getallusers = () => {
  return new Promise((resolve, reject) => {
    UserSchema.find()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

//To check whether email id exists
const isEmailexist = (email) => {
  return new Promise((resolve, reject) => {
    UserSchema.findOne({ email })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};


//To check whether user exists
const isUserexist = (username) => {
  return new Promise((resolve, reject) => {
    UserSchema.findOne({ username })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};
//insert new user
const insertUser = (userObj) => {
  return new Promise((resolve, reject) => {
    UserSchema(userObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

//get user by username
const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    if (!username) return false;
    UserSchema.findOne({ username })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getUserById = (_id) => {
  return new Promise((resolve, reject) => {
    if (!_id) return false;
    UserSchema.findOne({ _id })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const storeUserRefreshJWT = (_id, token) => {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.findOneAndUpdate(
        { _id },
        {
          $set: { "RefreshJWT.token": token, "RefreshJWT.addedAt": Date.now() },
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const updatePassword = (username, hashedPassword) => {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.findOneAndUpdate(
        { username },
        {
          $set: { password: hashedPassword },
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};


const Edituserprofile=(editid,update) => {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.findOneAndUpdate(
        { _id:editid },
        {
          $set: update,
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};


module.exports = {
  getallusers,
  insertUser,
  getUserByUsername,
  isEmailexist,
  getUserById,
  storeUserRefreshJWT,
  updatePassword,
  Edituserprofile,
  isUserexist
};