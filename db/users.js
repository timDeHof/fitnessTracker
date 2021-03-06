const { user } = require("pg/lib/defaults");
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
    if (user === undefined) return null;

    delete user.password;
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT username, password FROM users
       where username = '${username}';`
    );
    if (password !== user.password) {
      throw {
        name: "PasswordNotCorrectError",
        message: "Password does not match user in database",
      };
    }
    delete user.password;
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT * FROM users
      WHERE id = ${userId};
              `
    );

    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT * FROM users
        WHERE users.username = '${username}';
                `
    );
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
