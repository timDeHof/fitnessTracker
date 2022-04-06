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
    const { rows } = await client.query(
      `SELECT * FROM activities
                `
    );
    console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function createActivity({ name, description }) {
  try {
    const { rows: activity } = await client.query(
      `INSERT INTO activities( name, description )
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
                  `,
      [name, description]
    );
    console.log(activity);
    return activity;
  } catch (error) {
    console.log(error);
  }
}

//check line 52 i inc ase updateActivity Error
async function updateActivity({ id, name, description }) {
  try {
    const { rows } = await client.query(
      `UPDATE activities
      SET name = ${name}, description = ${description}
      WHERE id = ${id}
                  `,
      [id, name, description]
    );
    console.log(rows);
    return rows;
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
