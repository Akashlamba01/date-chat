const User = require("../../../models/user");
const { resp } = require("../../../utility/response");
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
      console.log("err from user signup", e);
      return resp.fail(res, "err from user signup", e);
    }
  },
};
