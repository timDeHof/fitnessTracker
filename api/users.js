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

userRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }
    if (password.length > 8) {
      next({
        name: "PasswordLengthError",
        message:
          "Password is too short, please type in 8 at least 8 characters",
      });
    }

    const user = await createUser({
      username,
      password,
    });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    const users = { id: user.id, username: user.username };

    res.send({
      users,
      message: "thank you for signing up",
      token,
    });
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

module.exports = { userRouter };

//Dummy Usernames/Password Below
