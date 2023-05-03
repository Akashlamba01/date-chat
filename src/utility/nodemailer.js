const nodemailer = require("../config/nodemailer");

exports.sendOtp = async (otp, email) => {
  try {
    let info = await nodemailer.transporter.sendMail({
      from: "team@date-chat.com", // sender address
      to: email, // list of receivers
      subject: "gmail verification", // Subject line
      text: `${otp} is your veryfication code for Date-Chat!`, // plain text body
      html: `<p><b>${otp}</b> is your veryfication code for <b>Date-Chat!</b></p>`, // html body
    });

    console.log("send: ", info);
    return;
  } catch (error) {
    console.log("error form sending mail", error);
    return;
  }
};
