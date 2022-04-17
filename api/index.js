const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db/users");
require("dotenv").config();

const { JWT_SECRET } = process.env;

apiRouter.get("/health", (req, res) => {
  res.send({ message: "Connected to route /health" });
});

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

const { userRouter } = require("./users");
apiRouter.use("/users", userRouter);
const { activitiesRouter } = require("./activities.js");
apiRouter.use("/activities", activitiesRouter);
const { routinesRouter } = require("./routines");
apiRouter.use("/routines", routinesRouter);
const { routineActivityRouter } = require("./routineActivity");
const req = require("express/lib/request");
apiRouter.use("/routineactivities", routineActivityRouter);

module.exports = apiRouter;
