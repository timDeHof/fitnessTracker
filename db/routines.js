const { user } = require("pg/lib/defaults");
const { client } = require("./client");
const { attachActivitiesToRoutines, getActivityById } = require("./activities");

async function getRoutineById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT * FROM routines
      WHERE id = ${id};
    `
    );
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

    const UpdatedRoute = await attachActivitiesToRoutines(routines);

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
    const updatedPublicRoutines = await attachActivitiesToRoutines(rows);
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
    const updatedPublicRoutines = await attachActivitiesToRoutines(rows);
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
    const updatedPublicRoutines = await attachActivitiesToRoutines(rows);
    return updatedPublicRoutines;
  } catch (error) {
    console.log(error);
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(
      `SELECT *, users.username as "creatorName",routineactivity."activityId" FROM routines
      JOIN users ON routines."creatorId" = users.id
      JOIN routineactivity ON routines.id = routineactivity."routineId"
      WHERE "isPublic" = 'true' AND routineactivity."activityId" = ${id};`
    );
    const updatedPublicRoutines = await attachActivitiesToRoutines(rows);
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
// id, isPublic, name, goal
async function destroyRoutine(id) {
  try {
    await client.query(`DELETE FROM routineactivity WHERE "routineId" = $1;`, [
      id,
    ]);
    const {
      rows: [routine],
    } = await client.query(`DELETE FROM routines WHERE id = $1 RETURNING *;`, [
      id,
    ]);

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
  getPublicRoutinesByActivity,
  updateRoutine,
  destroyRoutine,
};
