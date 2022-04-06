const { client } = require("./client");

async function getActivityById(id) {
  try {
    const { rows } = await client.query(
      `SELECT * FROM activities
            WHERE id = ${id};
                `
    );
    console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function getAllActivities() {
  try {
    const { rows } = await client.query(`SELECT * FROM activities;`);
    //console.log(rows);
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
    //console.log(activity);
    return activity;
  } catch (error) {
    console.log(error);
  }
}

//check line 52 i inc ase updateActivity Error
async function updateActivity({ id, ...fields }) {
  // console.log("given parameter:", { id, fields });

  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  // console.log("setString:", setString);
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
    // console.log("Updated Activity:", activity);
    return activity;
  } catch (error) {
    console.log(error);
  }
}

async function attachActivitiesToRoutines(routines) {
  // no side effects
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(", ");
  const routineIds = routines.map((routine) => routine.id);
  if (!routineIds?.length) return [];

  try {
    // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
    const { rows: activities } = await client.query(
      `
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities 
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."routineId" IN (${binds});
    `,
      routineIds
    );

    // loop over the routines
    for (const routine of routinesToReturn) {
      // filter the activities to only include those that have this routineId
      const activitiesToAdd = activities.filter(
        (activity) => activity.routineId === routine.id
      );
      // attach the activities to each single routine
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
