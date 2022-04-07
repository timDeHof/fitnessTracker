const { user } = require("pg/lib/defaults");
const { client } = require("./client");

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT * FROM routineActivity
      WHERE id = ${id};
    `
    );
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `INSERT INTO routineActivity( routineId, activityId, count, duration )
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `
    );
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getRoutineActivityById,
};
