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
const {
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
} = require("../db/routine_activities");
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
    const deletedRoutine = await destroyRoutine(routineId);
    res.send(deletedRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;
  const AllRoutineActivities = await getRoutineActivitiesByRoutine({
    id: routineId,
  });
  console.log(
    "************************AllRoutineActivities:",
    AllRoutineActivities
  );
  const filterArray = AllRoutineActivities.filter(() => {
    return AllRoutineActivities.activityId === activityId;
  });
  console.log("************************filterArray:", filterArray);

  const attachedActivity = {
    routineId: routineId,
    activityId: activityId,
    count: count,
    duration: duration,
  };
  try {
    if (filterArray.length === 0) {
      const attachActivityToRoutine = await addActivityToRoutine(
        attachedActivity
      );
      console.log(
        "************************attachActivityToRoutine:",
        attachActivityToRoutine
      );
      res.send(attachActivityToRoutine);
    } else {
      next({ name: "pairError", message: " uh oh" });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// getting a 'error: insert or update on table "routineactivity" violates foreign key constraint "routineactivity_routineId_fkey"'
module.exports = { routinesRouter };
