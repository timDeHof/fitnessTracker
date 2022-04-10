const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
} = require("../db/users");
const { token } = require("morgan");

const bodyParser = require("body-parser");
userRouter.use(bodyParser.json());
userRouter.post("/register", async (req, res, next) => {
  //console.log("req:", req);
  const { username, password } = req.body;

  console.log("here is the req.body", req.body);
  try {
    // const _user = await getUserByUsername(newUser);
    // console.log(_user);
    // console.log("The datatype of _user is ", typeof { _user });
    // if ({ _user }) {
    //   next({
    //     name: "UserExistsError",
    //     message: "A user by that username already exists",
    //   });
    //}
    if (password.length > 8) {
      next({
        name: "PasswordLengthError",
        message:
          "Password is too short, please type in 8 at least 8 characters",
      });
    }
    console.log("datatype of username:", typeof req.body);
    const registeredUser = await createUser(req.body);
    console.log("datatype of registeredUser:", typeof registeredUser);
    console.log("registered user:", registeredUser);
    const token = jwt.sign(
      { id: registeredUser.id, username: registeredUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1w" }
    );
    console.log("token:", token);

    res.json({
      message: "thank you for signing up",
      token: token,
    });
    //res.send({ registeredUser });
    //req.end();
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = { userRouter };

//Dummy Usernames/Password Below
