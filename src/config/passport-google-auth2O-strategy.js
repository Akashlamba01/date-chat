const passport = require("passport");
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },

    async function (accessToken, refreshToken, profile, cb) {
      await User.findOne({ email: profile.emails[0].value })
        .then(async (user) => {
          console.log("user from google: ", user);
          console.log("profile: ", profile);
          if (!user) {
            let newUser = await User.create({
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(8).toString("hex"),
            });
            cb(null, newUser);
          }

          return cb(null, user);
        })
        .catch((e) => {
          console.log("erro from google strategy: ", err);
          return;
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  //   User.findById(id, function (err, user) {
  //     done(err, user);
  //   });

  User.findById(id)
    .then((user) => {
      done(user);
    })
    .catch((e) => {
      done(e);
    });
});

module.exports = passport;
