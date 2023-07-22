const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');



// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "449724975312-rg4063ah4fbnto0jp2vmk3fchptp3797.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8080/users/auth/google/callback",
    },

    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        // find a user
        User.findOne({ email: profile.emails[0].value })
          .exec()
          .then(user => {
            if (user) {
              // if found the user, set the user as req.user
            //   console.log(user);
            //   console.log(profile);
            //   console.log(accessToken);
            //   console.log(refreshToken);
              return done(null, user);
            } else {
              // if not found, then create the user
              User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
              })
                .then(user => {
                  return done(null, user);
                })
                .catch(err => {
                  console.log('error in google strategy-passport', err);
                  return done(err);
                });
            }
          })
          .catch(err => {
            console.log('error in google strategy-passport', err);
            return done(err);
          });
      
    }
 
 ));
 
 
 module.exports=passport;