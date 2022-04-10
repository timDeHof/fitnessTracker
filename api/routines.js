//* Builds an activitiesRouter using express Router
const express = require("express");
const routinesRouter = express.Router();

const jwt = require("jsonwebtoken");

const { requireUser } = require("./utils");
const { JWT_SECRET } = process.env;
//* Imports the database adapter functions from the db

const {
  getPublicRoutinesByActivity,
  getAllPublicRoutines,
  createRoutine,
} = require("../db/routines");
routinesRouter.use((req, res, next) => {
  console.log("A request is being made to /routines");

  next();
});
/**
 * GET request for /routines
 *
 * - returns a list of all public routines, including the activities in the database
 * - has no request parameters
 */
routinesRouter.get("/", async (req, res) => {
  let allRoutines = await getAllPublicRoutines();
  console.log("all public routines:", allRoutines);
  //console.log(allActivities);
  res.send(allRoutines);
});
/**
 * POST request for /activities
 *
 * - creates a new routine in the database
 * - has request parameters:
 *        - name(string, required)
 *        - description(string, required)
 *        - isPublic(boolean, optional)
 * - must pass a valid token with this request, or it will be rejected
 */
routinesRouter.post("/", async (req, res, next) => {
  const { name, goal, isPublic } = req.body;
  const routineData = {};
  try {
    routineData.name = name;
    routineData.goal = goal;
    if (isPublic !== null) {
      routineData.isPublic = isPublic;
    }
    console.log("routineData:", routineData);
    const newRoutineData = await createRoutine(routineData);
    res.send({ newRoutineData });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

/**
 * PATCH request for /activities
 *
 * - updates an activity
 */
routinesRouter.patch("/:activityId", async (req, res, next) => {
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
 *  POST request for /routines/:routineId/activities
 *
 * - returns a list of public routines which feature
 *   that activity
 */
routinesRouter.post("/:routineId/activities", async (req, res, next) => {
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
module.exports = { routinesRouter };
