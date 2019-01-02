let express = require('express');
let app = express();

let adminController = require('./server/controllers/adminController')
let mainController = require('./server/controllers/mainController')
let userProfileController = require('./server/controllers/userProfileController')
let taskController = require('./server/controllers/taskController')
let authRoutes = require('./server/routes/auth-routes')

let passport = require('passport');
let passportSetup = require('./server/config/passport-setup');
let cookieSession = require('cookie-session');
let keys = require('./server/config/keys');

//static files
app.use(express.static('./client/assets'));
app.use(express.static('./client/js'));

//setup template engine
app.set('view engine', 'ejs');
app.set('views', __dirname+'/client/views');

//cookie
app.use(cookieSession({
    maxAge: 3*60*60*1000,
    keys: [keys.session.cookieKey]
}))

//initialise passport
app.use(passport.initialize());
app.use(passport.session());


//fire controllers 
adminController(app);
mainController(app);
userProfileController(app);
taskController(app);

//setup routes
app.use('/auth', authRoutes);

//catching everything else
app.get('/*', (req, res)=>{
    res.render('error');
})

//listening to provided port like glitch or local port 3000
var listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});