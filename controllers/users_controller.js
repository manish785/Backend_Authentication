const User = require('../models/user')
const crypto = require('crypto');
const { sendResetEmail } = require('../emailService');

// render the Sign Up page
module.exports.signUp = function(req, res){
    // If the user is signed up, then hittig this Sign Up route, will render to the same Sign Up page
    if(req.isAuthenticated()){
      return res.redirect('back');
    }

    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up',
   });
}

// render the Sign In page
module.exports.signIn = function(req, res){
    // If the user is signed in, then hittig this Sign In route, will render to the same Sign In page
    if(req.isAuthenticated()){
      return res.redirect('back');
    }

    return res.render('user_sign_in', {
        title: 'Codeial | Sign In',
   });
}

// get the Sign Up data
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
  //this functionality provides by passport.js (req.logout) for the Sign Out
  req.logout(function(err){
    if(err){
      console.log('Error in logging out', err);
      return;
    }
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
  });
}


module.exports.resetPassword = async (req, res) => {
  try {
    const user = await  User.findOne();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate the reset token and its expiration time
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // Token is valid for 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;

    await user.save();

    // Send the reset link to the user's email
    const resetLink = `http://update-password/reset-password?token=${resetToken}`;

    //console.log(resetLink);
   // console.log(user.email);
    await sendResetEmail(user.email, resetLink); // Call the email sending function

    return res.status(200).json({ message: 'Reset link sent successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error resetting password' });
  }
};

module.exports.updatePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update user's password and clear the reset token
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating password' });
  }
};



