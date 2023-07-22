const express = require('express');
const app = express();
const port = 8080;
// It middleware that helps parse HTTP cookies in incoming requests.When a client sends a request to a server, it can include cookies as part of the request headers. Cookies
// are small pieces of data stored on the client's browser and are used to maintain state and store user information. 
const cookieParser = require('cookie-parser');
//const { route } = require('express/lib/application');
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const passportJWT = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css/',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));


app.use(express.urlencoded());
app.use(cookieParser());


app.use(express.static('./assets'))
app.use(expressLayouts);

dotenv.config();
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB connection Succesful"))
.catch((err)=>{
    console.log(err);
    return;
});


// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongod store is used to store the session cookie in the db
app.use(session({
    // TODO: change the secret before deployment in production code
    secret: 'blahsomething',
    saveUninitialized: false, // when the user is not logged in, identity is not established, do we need to store extra data
    // that's why it is false
    resave: false, // when the identity is established, some session data is stored, dont want to save again and again
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        mongooseConnection: db,
        autoRemove: 'disabled'
      }, function (err){
        console.log(err || 'connect-mongod db setup ok');
      })
}));

app.use(passport.initialize());
app.use(passport.session());

 app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error while running the server: ${err}`);
        return;
    }
    console.log(`Server is running fine on port: ${port}`); //by the help of string interpolation, it took the value
})



