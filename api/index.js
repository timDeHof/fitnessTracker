const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserById, getUserByUsername } = require("../db/users");
const { getAllActivities } = require("../db/activities");
const { JWT_SECRET } = process.env;

apiRouter.get("/health", (req, res) => {
  res.send({ message: "Connected to route /health" });
});

// const userRouter = require("./users");

// apiRouter.use("/users", userRouter);

const activitiesRouter = require("./activities.js");
apiRouter.use("/activities", activitiesRouter);
// apiRouter.get("/activities", async (req, res, next) => {
//   let allActivities = await getAllActivities();
//   console.log(allActivities);
//   res.send(allActivities);
// });

// apiRouter.post("/activities", async (req, res, next) => {

//   res.send("hello this is post activities");
// });
// apiRouter.use(async (req, res, next) => {
//   const prefix = "Bearer ";
//   const auth = req.header("Authorization");

//   if (!auth) {
//     next();
//   } else if (auth.startsWith(prefix)) {
//     const token = auth.slice(prefix.length);

//     try {
//       const { id } = jwt.verify(token, JWT_SECRET);

//       if (id) {
//         req.user = await getUserById(id);
//         next();
//       }
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   } else {
//     next({
//       name: "AuthorizationHeaderError",
//       message: `Authorization token must start with ${prefix}`,
//     });
//   }
// });
//apiRouter.use("/routines", routines);
//apiRouter.use("/routineActivity", routineActivity);

apiRouter.use((error, req, res, next) => {
  res.send({ name: error.name, message: error.message });
});

module.exports = { apiRouter };
