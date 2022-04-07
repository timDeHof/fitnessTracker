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

module.exports = {
  getRoutineActivityById,
};
