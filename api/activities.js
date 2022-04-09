const express = require("express");
const activitiesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getAllActivities } = require("../db/activities");
activitiesRouter.use((req, res, next) => {
  console.log("A request is being made to /activities");

  next();
});
activitiesRouter.get("/", async (req, res) => {
  let allActivities = await getAllActivities();
  console.log(allActivities);
  res.send(allActivities);
});

activitiesRouter.post("/activities", async (req, res, next) => {
  res.send("hello this is post activities");
});

module.exports = { activitiesRouter };
