const { user } = require("pg/lib/defaults");
const { client } = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function getRoutineById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT * FROM routines
      WHERE id = ${id};
    `
    );
    console.log(user);
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
    console.log("rows:", rows);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

// activities.name as "activities_name",
// activities.description as "activity_description"
// FROM routines
// LEFT JOIN routines
// ON routines.activities."activities_name" = activities.name,
//    routines.activities."activity_description" = activities.description

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(
      `SELECT routines.*, users.username as "creatorName" FROM routines
        JOIN users ON routines."creatorId" = users.id;`
    );
    console.log("routines:", routines);
    const UpRou = await attachActivitiesToRoutines(routines);
    console.log("Updated Routines:", UpRou);
    return UpRou;
  } catch (error) {
    console.log(error);
  }
}

async function getAllPublicRoutines() {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `SELECT * FROM routines
          
          `
    );
    console.log(activity);
    return activity;
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
    console.log(routine);
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
};
