const express = require("express");
const activitiesRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  getAllActivities,
  createActivity,
  updateActivity,
} = require("../db/activities");
const { getPublicRoutinesByActivity } = require("../db/routines");
const { requireUser } = require("./utils");

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

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();
    res.send(allActivities);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  const newActivity = await createActivity({ name, description });
  res.send(newActivity);
  try {
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
  const update = {
    id: activityId,
    name: name,
    description: description,
  };
  try {
    const newActivity = await updateActivity(update);
    res.send(newActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  try {
    const stuff = await getPublicRoutinesByActivity({ id: activityId });
    res.send(stuff);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = { activitiesRouter };
