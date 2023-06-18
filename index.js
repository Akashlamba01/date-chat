const express = require("express");
require("dotenv").config();
const db = require("./src/config/conn");
const { errors } = require("celebrate");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded());
app.use(bodyParser.json());

app.use(
  session({
    name: "majorProject2",
    secret: "supersecret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 100 * 60 * 1000,
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.get("/", (req, res) => {
//   res.send("hello");
//   return;
// });

app.use("/", require("./src/routes"));

app.use(errors());

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
