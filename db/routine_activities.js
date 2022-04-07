const { user } = require("pg/lib/defaults");
const { client } = require("./client");

async function addActivityToRoutine() {
  console.log("hi");
}

module.exports = { addActivityToRoutine };
