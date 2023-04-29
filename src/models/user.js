const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    access_token: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    userName: String,
    password: String,
    dateOfBirth: String,
    getnder: String,
    city: String,
    cityState: String,

    // intrest: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
