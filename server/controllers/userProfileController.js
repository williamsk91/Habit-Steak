let mongoose = require('mongoose');
let UserProfile = require('../model/userModel.js');
let keys = require('../config/keys');
let bodyParser = require('body-parser');

//body parser
let urlencodedParser = bodyParser.urlencoded({extended: false});

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

    //change username
    app.post('/changeUsername', urlencodedParser, (req, res)=>{
        //find user's document by email address
        let conditionEmail = {email: req.user.email};

        //push task
        //then increment no of task count by 1
        let update = {username: req.body.username};

        UserProfile.findOneAndUpdate(conditionEmail, update, (err, data)=>{
            if(err) throw err;
            res.redirect('/userProfile');      
        })
    })

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