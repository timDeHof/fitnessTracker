const express = require("express");
const activitiesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getAllActivities } = require("../db/activities");
activitiesRouter.use((req, res, next) => {
  console.log("A request is being made to /activities");

  next();
});
activitiesRouter.get("/activities", async (req, res) => {
  let allActivities = await getAllActivities();
  console.log(allActivities);
  res.send(allActivities);
});

module.exports = activitiesRouter;
