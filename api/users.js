const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
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
// const { token } = require("morgan");

userRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  // console.log("here is the req.body", req.body);
  // const token = jwt.sign({ username, password }, process.env.JWT_SECRET);
  // res.send({
  //   message: "thanks for signing Up!",
  //   token: token,
  // });
  console.log("password.length:", password.length);
  try {
    const _user = await getUserByUsername(username);
    console.log("_user:", _user);
    console.log("The datatype of _user is ", typeof { _user });
    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }
    if (password.length < 8) {
      next({
        name: "PasswordLengthError",
        message:
          "Password is too short, please type in 8 at least 8 characters",
      });
    } else {
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

      return res.send({
        user: registeredUser,
        message: "thank you for signing up",
        token: token,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

userRouter.post("/login", async (req, res, next) => {
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

userRouter.get("/me", requireUser, async (req, res, next) => {
  const { username } = req.body;
  try {
    const everything = await getAllRoutinesByUser(username);
    res.send({ everything });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

userRouter.get("/users/:username/routines", async (req, res, next) => {
  const { username } = req.params;
  const user = getUserById(username);

  try {
    const routines = await getPublicRoutinesByUser(user.username);
    res.send({ routines });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = { userRouter };
