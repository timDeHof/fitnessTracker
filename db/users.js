const { client } = require("./client");

//hash passwords later
async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `INSERT INTO users(username, password)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
            `,
      [username, password]
    );
    delete user.password;
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUser({ username, password }) {
  try {
    const { rows } = await client.query(
      `SELECT * FROM users 
            `,
      [username, password]
    );
    console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function getUserById(userId) {
  try {
    const { rows: user } = await client.query(
      `SELECT * FROM users
      WHERE id = ${userId};
              `
    );
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: user } = await client.query(
      `SELECT * FROM users
        WHERE username = ${username};
                `
    );
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
