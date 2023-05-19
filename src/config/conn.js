// const mongoose = require("mongoose");
// require('dotenv').config();

// mongoose
//   .connect(
//     // `mongodb+srv://date-chat-db:${process.env.DB_KEY}@cluster0.tw9wtj7.mongodb.net/test`
//     "mongodb://127.0.0.1:27017/date-chat-db"
//   )
//   .then(() => {
//     console.log("connection connected");
//   })
//   .catch((e) => {
//     console.log("connection not connected");
//   });

const mongoose = require("mongoose");

const db = mongoose
  .connect("mongodb://127.0.0.1:27017/date-chat-db")
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("db not connected: ", err);
  });

module.exports = db;
