const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const bodyParser = require("body-parser");
userRouter.use(bodyParser.json());

const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
} = require("../db/users");

const {
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
} = require("../db/routines");

userRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  console.log("here is the req.body", req.body);
  try {
    // const _user = await getUserByUsername({ username });
    // console.log({ _user });
    // console.log(“The datatype of _user is ", typeof { _user });
    // if ({ _user }) {
    //   next({
    //     name: “UserExistsError”,
    //     message: “A user by that username already exists”,
    //   });
    // }
    if (password.length > 8) {
      next({
        name: "PasswordLengthError",
        message:
          "Password is too short, please type in 8 at least 8 characters",
      });
    }
    const registeredUser = await createUser(req.body);
    console.log("registered user:", registeredUser);
    // const token = jwt.sign(
    //   {
    //     id: user.id,
    //     username: user.username,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: “1w”,
    //   }
    // );
    console.log("token:", token);
    //
    // res.jsonp({
    // user: {
    //   id: user.id,
    //   username: user.username,
    // },
    //   message: “thank you for signing up”,
    //   token: token,
    // });
    res.send({ registeredUser });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

userRouter.post("/Login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }
  try {
    const user = await getUserByUsername(username);
    console.log(user);
    if (user && user.password == password) {
      const token = jwt.sign({ id: user.id, username }, JWT_SECRET);
      res.send({ message: "you are logged in!", token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.Get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;

  try {
    const userRoutine = getPublicRoutinesByUser(username);
    res.send(userRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

userRouter.Get("/users/:username", async (req, res, next) => {
  const { username } = req.body;
  try {
    const userInfo = getAllRoutinesByUser(username);
    res.send(userInfo);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = { userRouter };

//Dummy Usernames/Password Below
