const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
//const env = require('./environment');
const User = require('../models/user');


let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial',
}

passport.use(new JWTStrategy(opts, async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload._id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        console.log('Error in finding user from JWT payload:', err);
        return done(err); // or return done(err, false) if you want to indicate authentication failure
      }
    })
  );

module.exports = passport;

