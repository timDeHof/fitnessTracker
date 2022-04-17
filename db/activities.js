const { client } = require("./client");

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `SELECT * FROM activities
            WHERE id = ${id};`
    );
    return activity;
  } catch (error) {
    console.log(error);
  }
}

async function getAllActivities() {
  try {
    const { rows } = await client.query(`SELECT * FROM activities;`);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `INSERT INTO activities( name, description )
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
                  `,
      [name, description]
    );

    return activity;
  } catch (error) {
    console.log(error);
  }
}

async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    const {
      rows: [activity],
    } = await client.query(
      `UPDATE activities
      SET ${setString}
      WHERE id = ${id}
      RETURNING *;
      `,
      Object.values(fields)
    );

    return activity;
  } catch (error) {
    console.log(error);
  }
}

async function attachActivitiesToRoutines(routines) {
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(", ");
  const routineIds = routines.map((routine) => routine.id);
  if (!routineIds?.length) return [];

  try {
    const { rows: activities } = await client.query(
      `
      SELECT activities.*, routineactivity.duration, routineactivity.count, routineactivity.id AS "routineActivityId", routineactivity."routineId"
      FROM activities 
      JOIN routineactivity ON routineactivity."activityId" = activities.id
      WHERE routineactivity."routineId" IN (${binds});
    `,
      routineIds
    );

    for (const routine of routinesToReturn) {
      const activitiesToAdd = activities.filter(
        (activity) => activity.routineId === routine.id
      );

      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  attachActivitiesToRoutines,
  getActivityById,
  getAllActivities,
  createActivity,
  updateActivity,
};
