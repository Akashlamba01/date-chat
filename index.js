const express = require("express");
require("dotenv").config;
const db = require("./src/config/conn");
const exp = require("constants");
const { errors } = require("celebrate");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello");
  return;
});

app.use("/", require("./src/routes"));

app.use(errors());

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
