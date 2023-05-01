const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { resp } = require("./response");
const { func } = require("joi");

exports.verifyToken = (req, res, next) => {
  const token = req.header("accessToken");
  // console.log(token);
  if (!token) {
    return resp.unknown(res, "Token not available");
  }

  jwt.verify(token, "supersecret", async function (err, decode) {
    if (err) return resp.fail(res, "Invalid token");

    let user = await User.findOne({ accessToken: token });
    console.log("user from token : ", user);
    // userId = user.id;
    req.userData = user;
    next();
  });
};
