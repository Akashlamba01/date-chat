const express = require("express");
const router = express.Router();
const { Joi, celebrate } = require("celebrate");
const userContorller = require("../../../../controller/api/v1/user");

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
      c_password: Joi.ref("password"),
      dateOfBirth: Joi.string().required(),
      city: Joi.string().lowercase(),
      cityState: Joi.string().lowercase(),
    }),
  }),
  userContorller.signUp
);

module.exports = router;
