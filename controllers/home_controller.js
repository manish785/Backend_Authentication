
const User = require('../models/user');

module.exports.home = async function(req, res){
    //console.log(req.cookies);
    //res.cookie('user_id', 25);

        return res.render('home', {
            title: 'Home',
        });

    
       
    
}