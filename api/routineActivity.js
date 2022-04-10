//* Builds an activitiesRouter using express Router
const express = require("express");
const routineActivityRouter = express.Router();

const jwt = require("jsonwebtoken");
const {
  getRoutineActivityById,
  updateRoutineActivity,
} = require("../db/routine_activities");

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
    const routineactivityToUpdate = {};

    // checks if count exist
    if (count) {
      routineactivityToUpdate.count = count;
    }
    // checks if duration exist
    if (duration) {
      routineactivityToUpdate.duration = duration;
    }

    try {
      const originalRoutineActivity = await getRoutineActivityById(
        routineActivityId
      );
      if (originalRoutineActivity.id === routineActivityId) {
        const updatedRoutineActivity = await updateRoutineActivity(
          routineActivityId,
          routineactivityToUpdate
        );
        res.send({ routineActivity: updatedRoutineActivity });
      } else {
        next({
          name: "UnauthorizedUserError",
          message: "You cannot update a activity that is not yours",
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
      const routine = await getRoutineActivityById(routineActivityId);

      if (routine.id === routineActivityId) {
        const deletedRoutine = await destroyRoutineActivity(routineActivityId);
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
  }
);
module.exports = { routineActivityRouter };
