const express = require("express");
const apiRouter = express.Router();
const { JWT_SECRET } = process.env;

apiRouter.get("/health", (req, res) => {
  res.send({ message: "String" });
});

const userRouter = require("./users");
apiRouter.use("/users", userRouter);
//apiRouter.use("/activities", activities);
//apiRouter.use("/routines", routines);
//apiRouter.use("/routineActivity", routineActivity);

module.exports = apiRouter;
