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

module.exports = {
  getActivityById,
  getAllActivities,
  createActivity,
  updateActivity,
};
