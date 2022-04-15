//* Builds an activitiesRouter using express Router
const express = require("express");
const activitiesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
//* Imports the database adapter functions from the db
const {
  getAllActivities,
  createActivity,
  updateActivity,
} = require("../db/activities");
const { getPublicRoutinesByActivity } = require("../db/routines");

activitiesRouter.get("/", async (req, res) => {
  let allActivities = await getAllActivities();

  res.send(allActivities);
});

activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  const activityData = {};
  try {
    activityData.name = name;
    activityData.description = description;
    const newActivityData = await createActivity(activityData);
    res.send(newActivityData);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.patch("/:activityId", async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
  const newActivity = {};

  newActivity.id = activityId;
  if (name) {
    newActivity.name = name;
  }
  if (description) {
    newActivity.description = description;
  }
  try {
    const updatedActivity = await updateActivity(newActivity);
    res.send(updatedActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//Get a list of all public routines which feature that activity
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;

  try {
    const something = await getPublicRoutinesByActivity(activityId);
    console.log("We are looking for: ", something);
    res.send(something);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = { activitiesRouter };
