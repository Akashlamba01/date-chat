const nodemailer = require("nodemailer");
require("dotenv").config();

let testAccount = nodemailer.createTestAccount();

exports.transporter = nodemailer.createTransport({
  // service: "gmail",
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SECRET_KEY,
  },
});
