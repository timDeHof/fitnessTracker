//* Builds an activitiesRouter using express Router
const express = require("express");
const routineActivityRouter = express.Router();

const jwt = require("jsonwebtoken");
const {
  getRoutineActivityById,
  updateRoutineActivity,
  destroyRoutineActivity,
} = require("../db/routine_activities");
const { getRoutineById } = require("../db/routines");
const { requireUser } = require("./utils");
const { JWT_SECRET } = process.env;
//* Imports the database adapter functions from the db

routineActivityRouter.use((req, res, next) => {
  console.log("A request is being made to /routines");

  next();
});

/**
 *  PATCH request for /routineactivities/:routineactivityId
 *
 *  - Updates the count or duration on the routine activity
 *  - (**) the logged in user should be the owner of the modified object
 *  - Request Parameters:
 *      - count (number, optional)
 *      - duration (number, optional)
 */
routineActivityRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;

    const newObj = {
      id: routineActivityId,
      count: count,
      duration: duration,
    };
    try {
      const routineActivity = await getRoutineActivityById(routineActivityId);
      const routine = await getRoutineById(routineActivity.routineId);

      if (routine.creatorId === req.user.id) {
        const hello = await updateRoutineActivity(newObj);

        res.send(hello);
      } else {
        next({
          name: "error",
          message: " you must be the  creator to edit this",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

/**
 *  DELETE request for /routinesactivities/:routineId
 *
 *  - Removes an activity from a routine, using Hard delete.
 *
 */
routineActivityRouter.delete(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId } = req.params;

    try {
      const routineActivity = await getRoutineActivityById(routineActivityId);
      const routine = await getRoutineById(routineActivity.routineId);

      if (routine.creatorId === req.user.id) {
        const hello = await destroyRoutineActivity(routineActivityId);

        res.send(hello);
      } else {
        next({
          name: "error",
          message: " you must be the  creator to edit this",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);
module.exports = { routineActivityRouter };
