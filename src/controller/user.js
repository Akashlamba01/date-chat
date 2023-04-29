const User = require("../models/user");
const { resp } = require("../utility/response");
const md5 = require("md5");

module.exports = {
  getUser: async (req, res) => {
    let user = await User.find();
    // let user = "this is user";
    // console.log(user);
    return resp.success(res, "success", user);
  },

  signUp: async (req, res) => {
    try {
      if (req.body.password != req.body.c_password) {
        return resp.unknown(res);
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
      return resp.fail(res, "err from user signup", e);
    }
  },

  login: async (req, res) => {
    // console.log("klljlkjlkjlkjl", req.body.email);
    try {
      let user = await User.findOne({ email: req.body.email });

      if (!user) {
        return resp.notFound(res, "User not found");
      }

      if (user.password != md5(req.body.password)) {
        return resp.unknown(res, "Invalid details");
      }

      return resp.success(res, "login successfully", user);
    } catch (error) {
      // console.log("err from user signin", error);
      return resp.fail(res, "err from user signin", error);
    }
  },

  update: async (req, res) => {
    try {
      let user = User.findByIdAndUpdate(req.params.id, req.body);
      console.log(user);

      return resp.success(res, "User Updated!", user);
    } catch (e) {
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
};
