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

userRouter.get("/", async (req, res) => {
  const users = await getUser();

  res.send({
    users,
  });
});

userRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  console.log("here is the req.body", req.body);
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

    res.send({
      message: "thank you for signing up",
      token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = { userRouter };

//Dummy Usernames/Password Below
