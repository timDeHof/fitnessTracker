const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db/users");
//const bodyParser = require("body-parser");
//apiRouter.use(bodyParser.json());
const { JWT_SECRET } = process.env;

apiRouter.get("/health", (req, res) => {
  res.send({ message: "Connected to route /health" });
});

const { userRouter } = require("./users");

apiRouter.use("/users", userRouter);

const { activitiesRouter } = require("./activities.js");
apiRouter.use("/activities", activitiesRouter);

const { routinesRouter } = require("./routines");
apiRouter.use("/routines", routinesRouter);
const { routineActivityRouter } = require("./routineActivity");
apiRouter.use("/routineactivities", routineActivityRouter);

apiRouter.use((error, req, res, next) => {
  res.send({ name: error.name, message: error.message });
});

module.exports = apiRouter;
