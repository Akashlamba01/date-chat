const { resp } = require("../../../utility/response");

module.exports = {
  getHome: (req, res) => {
    return res.send("<h1>helo from home</h1>");
  },
};
