const User = require('../models/user')
const crypto = require('crypto');

// render the sign up page
module.exports.signUp = function(req, res){
    // If the user is signed in, then hittig this Sign Up route, will render to the users profile
    if(req.isAuthenticated()){
      return res.redirect('/users/profile/:id');
    }

    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up',
   });
}

// render the sign in page
module.exports.signIn = function(req, res){
    // If the user is signed in, then hittig this Sign In route, will render to the users profile
    if(req.isAuthenticated()){
      return res.redirect('/users/profile/:id');
    }

    return res.render('user_sign_in', {
        title: 'Codeial | Sign In',
   });
}

// get the sign up data
module.exports.create = async function(req, res) {
    if (req.body.password != req.body.confirm_password) {
      console.log('Password and Confirm Password is not matching!');
      return res.redirect('back');
    }
  
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        // when we will create a new user, it will render towards the users's sign in page
        let data ={
          name: req.body.name,
          email : req.body.email,
          password: crypto.randomBytes(20).toString('hex')
        }
        await User.create(data);
        req.flash('success', 'Sign UP successfully');
        return res.redirect('/users/sign-in');
      } else {
        return res.redirect('back');
      }
    } catch (err) {
      console.log('error in signing up:', err);
      // Handle the error appropriately
      return res.redirect('back');
    }
  };
  

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
}


module.exports.destroySession = function(req, res){
  //this functionality provides by passport.js (req.logout)
  req.logout(function(err){
    if(err){
      console.log('Error in logging out', err);
      return;
    }
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
  });
}
