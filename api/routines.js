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

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
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
