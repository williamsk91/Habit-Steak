let mongoose = require('mongoose');
let UserProfile = require('../model/userModel.js');
let keys = require('../config/keys');

//connect to mLab database
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true });

//check if user is logged in
const authCheck = (req, res, next)=>{
    if(!req.user){
        //not logged in
        res.redirect('/auth/login');
    } else {
        //logged in
        next();
    }
};

module.exports = (app) =>{
    //go to user profile page
    app.get('/userProfile', authCheck, (req, res)=>{
        res.render('userProfile', {data: req.user});
    });

    //delete account
    app.delete('/userProfile/:id', (req, res)=>{
        UserProfile.findById(req.params.id).deleteOne( (err, data)=>{
            //delete user
            if(err) throw err;
            console.log('Account deleted!');
            res.json({});
        });
    });


};