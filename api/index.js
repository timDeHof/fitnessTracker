const express = require("express");
const apiRouter = express.Router();
const { JWT_SECRET } = process.env;

apiRouter.get("/health", (req, res) => {
  res.send({ message: "String" });
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

//const { activitiesRouter } = require("./activities")
//apiRouter.use("/activities", *activities router*)

//apiRouter.use("/routines", routines);
//apiRouter.use("/routines", *routines router*)

//apiRouter.use("/routineActivity", routineActivity);
//apiRouter.use("/routineActivity", *routine activity router*)

apiRouter.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});

module.exports = apiRouter;
