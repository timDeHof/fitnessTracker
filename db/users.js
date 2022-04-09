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
    delete user.password;
    console.log("user from createUser:", user);
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
  console.log("datatype of username in getUserByUserName:", typeof username);
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT * FROM users
        WHERE username = '${username}';
                `
    );
    console.log("user from getUserByUsername:", user);
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
