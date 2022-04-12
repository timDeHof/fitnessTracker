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
const { getPublicRoutinesByActivity } = require("../db/routines");
// activitiesRouter.use((req, res, next) => {
//   console.log("A request is being made to /activities");

//   next();
// });
activitiesRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    const { username, password } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { username };
    next();
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
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
  const { name, description } = req.body;
  const activityData = {};
  try {
    activityData.name = req.body.name;
    activityData.description = req.body.description;
    console.log("activityData:", activityData);
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
  //console.log("req.body:", req.body);
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
  console.log("activity Id:", activityId);
  console.log("datatype for activity id:", typeof activityId);
  try {
    const [getAllPublicRoutines] = await getPublicRoutinesByActivity(
      activityId
    );
    console.log("Public Routines by Activity:", getAllPublicRoutines);
    res.send(getAllPublicRoutines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = { activitiesRouter };
