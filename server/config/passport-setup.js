let passport = require('passport');
let GoogleStrategy = require('passport-google-oauth20');
let keys = require('../config/keys');
let UserProfile = require('../model/userModel');

//stuff user id to cookie
passport.serializeUser((user, done)=>{
    done(null, user.id);
});

//decode info from cookie using id
passport.deserializeUser((id, done)=>{
    console.log('id is: ' + id);
    UserProfile.findById(id).then((user) => {
        done(null, user);
    })
});

passport.use(new GoogleStrategy({
    //options for Google strategy
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    // the callback - check if user exists in db
    UserProfile.findOne({email: profile.emails[0].value}).then( (currentUser) => {
        if(currentUser){
            //already a user
            console.log('loyal customer has arrived');
            console.log('email ' + profile.emails[0].value);

            //move on to serialize user
            done(null, currentUser);
        } else {
            //not a user - let's make a new user data
            let username = profile.displayName;
            if(!username){
                //if empty
                username = 'set your username'
            }
            new UserProfile({
                userID: profile.id,
                username: username,
                email: profile.emails[0].value
            }).save().then((newUser)=>{
                console.log('new user created');
                console.log('email ' + profile.emails[0].value);
                
                //move on to serialize user
                done(null, newUser);
            })
        }
    });

    
}))