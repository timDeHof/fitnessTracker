//* Builds an activitiesRouter using express Router
const express = require("express");
const activitiesRouter = express.Router();

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
//* Imports the database adapter functions from the db
const {
  getAllActivities,
  createActivity,
  getActivityById,
} = require("../db/activities");

activitiesRouter.use((req, res, next) => {
  console.log("A request is being made to /activities");

  next();
});
/**
 * GET request for /activities
 *
 * - returns a list of all activities in the database
 * - has no request parameters
 */
activitiesRouter.get("/", async (req, res) => {
  let allActivities = await getAllActivities();
  //console.log(allActivities);
  res.send(allActivities);
});
/**
 * POST request for /activities
 *
 * - creates a new activity in the database
 * - has request parameters:
 *        - name(string)
 *        - description(string)
 * - must pass a valid token with this request, or it will be rejected
 */
activitiesRouter.post("/activities", async (req, res, next) => {
  const { name, description } = res.body;
  const activityData = {};
  try {
    activityData.name = name;
    activityData.description = description;
    const newActivityData = await createActivity(activityData);
    res.send({ newActivityData });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

/**
 * PATCH request for /activities
 *
 * - updates an activity
 */
activitiesRouter.patch("/:activityId", async (req, res, next) => {
  console.log("req.body:", req.body);
  const { activityId } = req.params;
  const { name, description } = req.body;
  const updateActivity = {};

  if (name) {
    updateActivity.name = name;
  }

  if (description) {
    updateActivity.description = description;
  }
  try {
    const originalActivity = await getActivityById(activityId);
    if (originalActivity.id === activityId) {
      const updatedActivity = await updateActivity(activityId, updateActivity);
      res.send({ activity: updatedActivity });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a activity that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

/**
 *  Get request for /activities/:activityId/routines
 *
 * - returns a list of public routines which feature
 *   that activity
 */
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  res.send("hello, this is get routines by activity");
});
module.exports = { activitiesRouter };
