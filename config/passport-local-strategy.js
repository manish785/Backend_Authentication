//const { ignore } = require('nodemon/lib/rules');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcrypt'); 


// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async function(req, email, password, done) {
    try {
        // find a user and establish the identity
        const user = await User.findOne({ email: email });
        console.log(user);
        if (!user || (user.password!=req.body.password)) {
            req.flash('error', 'Invalid Username or Password!');
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        req.flash('error', err);
        return done(err);
    }
}));



// serializing the user to decide which key is to kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id)
    .then(user => {
      if (!user) {
        console.log('User not found');
        return done(null, false);
      }
      return done(null, user);
    })
    .catch(err => {
      console.log('Error in finding the user --> Passport', err);
      return done(err);
    });
  });
  

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}


passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
       // req.user contains the current signed in user from the session cookie and we are just sending
       // this to the locals for the views
       res.locals.user = req.user;
    }
    next();
}



module.exports = passport;






