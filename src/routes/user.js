const express = require("express");
const router = express.Router();
const { Joi, celebrate } = require("celebrate");
const userContorller = require("../controller/user");
const auth = require("../utility/middleware");
const passport = require("passport");
const passportGoogle = require("../config/passport-google-auth2O-strategy");

router.get("/", userContorller.getUser);

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string(),
      email: Joi.string().email().lowercase().required(),
      phone: Joi.string().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,16}$"))
        .required()
        .min(8),
      cPassword: Joi.ref("password"),
      dateOfBirth: Joi.string().required(),
      userName: Joi.string().optional(),
      city: Joi.string().lowercase(),
      cityState: Joi.string().lowercase(),
    }),
  }),
  userContorller.signUp
);

router.post(
  "/sendOtp",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().lowercase().required(),
    }),
  }),
  userContorller.sendOtp
);

router.post(
  "/verifyOtp",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().lowercase().required(),
      verificationCode: Joi.number().required(),
    }),
  }),
  userContorller.verifyOtp
);

router.post(
  "/forgetPassword",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().lowercase().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,16}$"))
        .required()
        .min(8),
      cPassword: Joi.ref("password"),
      verificationCode: Joi.number().required(),
    }),
  }),
  userContorller.forgetPassword
);

router.post(
  "/login",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().lowercase().optional(),
      userName: Joi.string().optional(),
      password: Joi.string().optional(),
    }),
  }),
  userContorller.login
);

router.post(
  "/update/:id",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().optional(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().lowercase().optional(),
      phone: Joi.string().optional(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,16}$"))
        .min(8)
        .optional(),
      dateOfBirth: Joi.string().optional(),
      userName: Joi.string().optional(),
      city: Joi.string().lowercase().optional(),
      cityState: Joi.string().lowercase().optional(),
    }),
  }),
  auth.verifyToken,
  userContorller.update
);

router.post("/logout", auth.verifyToken, userContorller.logout);

router.post(
  "/change-password/:id",
  celebrate({
    body: Joi.object().keys({
      password: Joi.string().required(),
      newPassword: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,16}$"))
        .required()
        .min(8),
      cPassword: Joi.ref("newPassword"),
    }),
  }),
  auth.verifyToken,
  userContorller.changePassword
);

router.post(
  "/upload-img/:id",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string(),
    }),
  }),
  auth.verifyToken,
  userContorller.uploadImg
);

// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/users/sign-in",
//   }),
//   userContorller.user
// );

module.exports = router;
