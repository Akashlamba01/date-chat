const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const AVATAR_PATH = path.join("../upload/images/users/avatar");

const userSchema = new mongoose.Schema(
  {
    accessToken: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    userName: String,
    password: String,
    dateOfBirth: String,
    gender: String,
    city: String,
    cityState: String,
    avatar: String,
    verificationCode: String,
    isVerified: {
      type: Boolean,
      default: false,
    },

    // intrest: String,
  },
  {
    timestamps: true,
  }
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../src/", AVATAR_PATH));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

userSchema.statics.uploadAvatar = multer({ storage: storage }).single("avatar");
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model("User", userSchema);
module.exports = User;
