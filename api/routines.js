const express = require("express");
const routinesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils");
const { JWT_SECRET } = process.env;

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
  next();
});
routinesRouter.get("/", async (req, res) => {
  let allRoutines = await getAllPublicRoutines();
  res.send(allRoutines);
});

routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, goal, isPublic } = req.body;
  const userId = req.user.id;
  const newRoutine = {
    creatorId: userId,
    isPublic: isPublic,
    name: name,
    goal: goal,
  };
  try {
    const newRoutineData = await createRoutine(newRoutine);
    res.send(newRoutineData);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { name, goal, isPublic } = req.body;
  const update = {
    id: routineId,
    name: name,
    goal: goal,
    isPublic: isPublic,
  };
  try {
    const newRoutine = await updateRoutine(update);
    res.send(newRoutine);
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
