const { user } = require("pg/lib/defaults");
const { client } = require("./client");

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `SELECT * FROM routineActivity
      WHERE id = ${id};
    `
    );

    return routineActivity;
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
      rows: [routineActivity],
    } = await client.query(
      `INSERT INTO routineActivity( "routineId", "activityId", count, duration )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );

    return routineActivity;
  } catch (error) {
    console.log(error);
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `UPDATE routineActivity
      SET ${setString}
      WHERE id = ${id} 
      RETURNING *;
    `,
      Object.values(fields)
    );

    return routineActivity;
  } catch (error) {
    console.log(error);
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `DELETE FROM routineActivity
      WHERE id = $1
      RETURNING *;
    `,
      [id]
    );

    return routineActivity;
  } catch (error) {
    console.log(error);
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(
      `SELECT * FROM routineActivity
      WHERE routineActivity."routineId" = ${id};
    `
    );

    return rows;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,
};
