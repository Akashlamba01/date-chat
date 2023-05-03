const User = require("../models/user");
const { resp } = require("../utility/response");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const auth = require("../utility/middleware");
const nodemailerVerification = require("../utility/nodemailer");

module.exports = {
  getUser: async (req, res) => {
    let user = await User.find();
    // let user = "this is user";
    // console.log(user);
    return resp.success(res, "success", user);
  },

  signUp: async (req, res) => {
    try {
      req.body.accessToken = jwt.sign(
        { email: req.body.email },
        "supersecret",
        {
          expiresIn: "10m",
        }
      );
      if (req.body.password != req.body.c_password) {
        return resp.unknown(res, "Passwords are not matched!");
      }

      let user = await User.findOne({
        email: req.body.email,
      });

      if (!user) {
        req.body.password = md5(req.body.password);
        let userData = await User.create(req.body);
        // console.log(userData);
        return resp.success(res, "signup successfuly", userData);
      }
      return resp.taken(res, "email has already exitst");
    } catch (e) {
      // console.log("err from user signup", e);
      console.log(e);
      return resp.fail(res, "err from user signup", e);
    }
  },

  sendOtp: async (req, res) => {
    try {
      let otp = Math.floor(1000 + Math.random() * 9000);
      await nodemailerVerification.sendOtp(otp, req.body.email);

      let verifyEmail = await User.findOneAndUpdate(
        {
          email: req.body.email,
        },
        {
          verificationCode: otp,
        },
        {
          new: true,
        }
      );

      // console.log(verifyEmail)
      if (!verifyEmail) {
        return resp.notFound(res, "email not found!");
      }

      return resp.success(res, "OTP sent on your Registered Email Address!");
    } catch (error) {
      return resp.fail(res, "err from otp verification!", error);
    }
  },

  verifyOtp: async (req, res) => {
    try {
      let verificationCode = req.body.verificationCode;
      let user = await User.findOne({
        email: req.body.email,
      });

      if (!user) {
        return resp.notFound(res, "email not found");
      }

      if (verificationCode != user.verificationCode) {
        return resp.unknown(res, "Srry, Invalid OTP!");
      }

      let userVerified = await User.findOneAndUpdate(
        {
          email: req.body.email,
        },
        {
          isVerified: true,
          verificationCode: null,
        },
        {
          new: true,
        }
      );

      return resp.success(res, "Email verified, Successfuly!", userVerified);
    } catch (error) {
      console.log(error);
      return resp.fail(res, "err from otp verification!", error);
    }
  },

  login: async (req, res) => {
    try {
      req.body.accessToken = jwt.sign(
        { email: req.body.email },
        "supersecret",
        {
          expiresIn: "10m",
        }
      );
      let user = await User.findOne({ email: req.body.email });
      if (!user || user.password != md5(req.body.password)) {
        return resp.unknown(res, "Invalid Credentials");
      }

      let userData = await User.findOneAndUpdate(
        { email: user.email },
        {
          accessToken: req.body.accessToken,
        },
        { new: true }
      );
      return resp.success(res, "loged In Successfully", userData);
    } catch (error) {
      return resp.fail(res, "err from user signin", error);
    }
  },

  update: async (req, res) => {
    // console.log("from token", userId);
    try {
      let user = await User.findById(req.params.id);
      if (!user) {
        return resp.unauthorized(res, "Invalid Id");
      }
      req.body.accessToken = jwt.sign({ email: user.email }, "supersecret", {
        expiresIn: "10m",
      });

      let userData = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      return resp.success(res, "User Updated!", userData);
    } catch (e) {
      return resp.fail(res);
    }
  },

  logout: async (req, res) => {
    try {
      let user = await User.findByIdAndUpdate(
        req.userData.id,
        {
          accessToken: "",
        },
        {
          new: true,
        }
      );
      if (!user) {
        return resp.fail(res);
      }
      return resp.success(res, "user loged out!");
    } catch (err) {
      return resp.fail(res);
    }
  },

  changePassword: async (req, res) => {
    try {
      let user = await User.findById(req.params.id);
      if (!user) {
        return resp.unauthorized(res);
      }

      if (user.password == md5(req.body.password)) {
        if (req.body.password == req.body.newPassword) {
          return resp.taken(res, "Same password is not allowed!");
        }
        let userData = await User.findByIdAndUpdate(req.params.id, {
          password: md5(req.body.newPassword),
        });
        return resp.success(res, "password changed successfully!", userData);
      }

      return resp.unknown(res, "Invalid password");
    } catch (e) {
      return resp.fail(res, "err from user signin", e);
    }
  },

  uploadImg: async (req, res) => {
    try {
      let user = await User.findById(req.params.id);
      if (!user) {
        return resp.unauthorized(res);
      }

      User.uploadAvatar(req, res, async function (err) {
        if (err) {
          console.log(err);
        }
        // console.log(user.avatar);
        if (req.file) {
          // if (user.avatar) {
          //   let avatarPrePath = path.join(__dirname, "..", user.avatar);
          //   await fs.unlink(avatarPrePath, (err) => {
          //     if (err) throw err;
          //     console.log("filepath: ", avatarPrePath);
          //   });
          // }

          user.avatar = User.avatarPath + "/" + req.file.filename;
          console.log(user.avatar);
        }

        user.save();
        // console.log(req.file);
      });

      return resp.success(res, "fileupload", user);
    } catch (e) {
      return resp.fail(res);
    }
  },
};
