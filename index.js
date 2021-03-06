require("dotenv").config();
const PORT = 3000;
const express = require("express");
const server = express();
const apiRouter = require("./api");
const { client } = require("./db/client");
const morgan = require("morgan");
server.use(morgan("dev"));
const cors = require("cors");
server.use(cors());
server.use(express.json());

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

server.use((error, req, res, next) => {
  if (res.statusCode < 400) res.status(500);
  res.send({
    error: error.message,
    name: error.name,
    message: error.message,
  });
});

client.connect();

server.use("/api", apiRouter);

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
