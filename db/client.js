const { Client } = require("pg");

const connectionString = "https://localhost:5432/fitness-dev";

const client = new Client({ connectionString });

module.exports = { client };
