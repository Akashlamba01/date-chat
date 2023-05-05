const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "178231003366-g1jmfg9e4hcmsc3j6a9ovnu07orh1mg2.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3001/users/auth/google/callback",
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
