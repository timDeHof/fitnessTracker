//* Builds an activitiesRouter using express Router
const express = require("express");
const routineActivityRouter = express.Router();

const jwt = require("jsonwebtoken");

const { requireUser } = require("./utils");
const { JWT_SECRET } = process.env;
//* Imports the database adapter functions from the db

module.exports = { routineActivityRouter };
