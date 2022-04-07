const { user } = require("pg/lib/defaults");
const { client } = require("./client");
const { attachActivitiesToRoutines, getActivityById } = require("./activities");
const { destroyRoutineActivity } = require("./routine_activities");
//

async function getRoutineById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT * FROM routines
      WHERE id = ${id};
    `
    );
    //console.log(user);
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(
      `SELECT * FROM routines
      `
    );
    //console.log("rows:", rows);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(
      `SELECT routines.*, users.username as "creatorName" FROM routines
        JOIN users ON routines."creatorId" = users.id;`
    );
    //console.log("routines:", routines);
    const UpdatedRoute = await attachActivitiesToRoutines(routines);
    //console.log("Updated Routines:", UpdatedRoute);
    return UpdatedRoute;
  } catch (error) {
    console.log(error);
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(
      `SELECT *, users.username as "creatorName" FROM routines
      Join users ON routines."creatorId" = users.id
      WHERE "isPublic" = 'true';`
    );
    //console.log("Public Routines", rows);
    const updatedPublicRoutines = await attachActivitiesToRoutines(rows);
    //console.log("updatedPublicRoutines:", updatedPublicRoutines);
    return updatedPublicRoutines;
  } catch (error) {
    console.log(error);
  }
}
async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `SELECT *, users.username as "creatorName" FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE users.username = '${username}';`
    );
    //console.log("Public Routines", rows);
    const updatedPublicRoutines = await attachActivitiesToRoutines(rows);
    //console.log("updatedPublicRoutines:", updatedPublicRoutines);
    return updatedPublicRoutines;
  } catch (error) {
    console.log(error);
  }
}
async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `SELECT *, users.username as "creatorName" FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE "isPublic" = 'true' AND users.username = '${username}';`
    );
    //console.log("Public Routines by User", rows);
    const updatedPublicRoutines = await attachActivitiesToRoutines(rows);
    //console.log("updatedPublicRoutines by User:", updatedPublicRoutines);
    return updatedPublicRoutines;
  } catch (error) {
    console.log(error);
  }
}

async function getPublicRoutinesByActivity({ id }) {
  //let activity = await getActivityById(id);

  try {
    const { rows } = await client.query(
      `SELECT *, users.username as "creatorName" FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE "isPublic" = 'true' AND  = '${id}';`
    );
    //console.log("Public Routines by Activity:", rows);
    const updatedPublicRoutines = await attachActivitiesToRoutines(rows);
    //console.log("updatedPublicRoutines by Activity:", updatedPublicRoutines);
    return updatedPublicRoutines;
  } catch (error) {
    console.log(error);
  }
}
async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1,$2,$3,$4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );
    //console.log(routine);
    return routine;
  } catch (error) {
    console.log(error);
  }
}
async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  try {
    const {
      rows: [routine],
    } = await client.query(
      `UPDATE routines
     SET ${setString}
     WHERE id = ${id}
     RETURNING *;`,
      Object.values(fields)
    );
    return routine;
  } catch (error) {
    console.log(error);
  }
}

async function destroyRoutine(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `DELETE FROM routines WHERE id = ${id} RETURNING *;`
    );
    const {
      rows: [routineId],
    } = await client.query(
      `SELECT DISTINCT "routineId" FROM routineactivity WHERE "routineId" = ${id} RETURN *;`
    );
    console.log("routineId:", routineId);
    destroyRoutineActivity(routineId);
    console.log("deleted routine:", routine);
    return routine;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getAllRoutines,
  createRoutine,
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  //getPublicRoutinesByActivity,
  updateRoutine,
  destroyRoutine,
};
