//* Builds an activitiesRouter using express Router
const express = require("express");
const routinesRouter = express.Router();

const jwt = require("jsonwebtoken");

const { requireUser } = require("./utils");
const { JWT_SECRET } = process.env;
//* Imports the database adapter functions from the db

const { getUser } = "../db/users";
const {
  getPublicRoutinesByActivity,
  getAllPublicRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
} = require("../db/routines");
const { addActivityToRoutine } = require("../db/routine_activities");
routinesRouter.use((req, res, next) => {
  console.log("A request is being made to /routines");

  next();
});
routinesRouter.get("/", async (req, res) => {
  let allRoutines = await getAllPublicRoutines();
  //console.log("all public routines:", allRoutines);
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
routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, goal, isPublic } = req.body;
  const user = req.user;

  const routineData = {};
  try {
    routineData.name = name;
    routineData.goal = goal;
    if (isPublic !== null) {
      routineData.isPublic = isPublic;
    }
    console.log(" neeed to find routine data: ", routineData);
    const newRoutineData = await createRoutine(user.id, name, goal, isPublic);
    res.send(newRoutineData);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

/**
 * PATCH request for /activities
 *
 * - updates an activity
 */
routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  //console.log("req.body:", req.body);
  const { routineId } = req.params;
  const { name, goal, isPublic } = req.body;
  const routineToUpdate = {};

  if (name) {
    routineToUpdate.name = name;
  }

  if (goal) {
    routineToUpdate.goal = goal;
  }
  if (isPublic !== null) {
    routineToUpdate.isPublic = isPublic;
  }
  try {
    const originalRoutine = await getRoutineById(routineId);
    if (originalRoutine.id === routineId) {
      const updatedRoutine = await updateRoutine(routineId, routineToUpdate);
      res.send({ routine: updatedRoutine });
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
 *  DELETE request for /routines/:routineId
 *
 *  - Hard delete a routine.
 *  - Deletes all the routineActivities whose routine is the one being deleted.
 */
routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;

  try {
    const routine = await getRoutineById(routineId);

    if (routine.id === routineId) {
      const deletedRoutine = await destroyRoutine(routineId);
      res.send({ routine: deletedRoutine });
    } else {
      next(
        routine
          ? {
              name: "UnauthorizedUserError",
              message: "You cannot delete a routine which is not yours",
            }
          : {
              name: "routineNotFoundError",
              message: "That routine does not exist",
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

/**
 *  POST request for /routines/:routineId/activities
 *
 *  - Attaches a single activity to a routine.
 *  - Prevents duplication on (routineId, activityID) pair
 *  - Request Parameters:
 *      - activityId (number)
 *      - count (number)
 *      - duration (number)
 *
 */
routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;
  console.log("routine Id:", routineId);
  console.log("datatype for routine id:", typeof routineId);
  try {
    const attachActivityToRoutine = await addActivityToRoutine({
      routineId,
      activityId,
      count,
      duration,
    });
    res.send({ attachActivityToRoutine });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// getting a 'error: insert or update on table "routineactivity" violates foreign key constraint "routineactivity_routineId_fkey"'
module.exports = { routinesRouter };
