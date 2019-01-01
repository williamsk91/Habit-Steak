let mongoose = require('mongoose');
let UserProfile = require('../model/userModel.js');
let bodyParser = require('body-parser');
let keys = require('../config/keys');

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

//given a tasks array, taskId, year and month returns the completed and confirmed arrays
const completedConfirmedArray = (tasks, taskId, year, month)=>{
    //looping through the tasks
    for(let i = 0; i < tasks.length; i++){
        //if taskId mathches
        if(tasks[i].taskId == taskId){
            //loop through the history of the task
            for(let j = 0; j < tasks[i].history.length; j++){
                //if year and month matches return the completed and confirmed arrays
                if(tasks[i].history[j].year == year && tasks[i].history[j].month == month){
                    let completedA = tasks[i].history[j].completed;
                    let confirmedA = tasks[i].history[j].confirmed;
                    return {completedA, confirmedA};
                }
            }
        }
    }
    //if not found return empty obj
    return {}
}


//returns number of days in that month given the month and year
function daysInMonth (month, year) {
    return new Date(year, month+1, 0).getDate();
}

module.exports = (app)=>{
    //got to main page
    app.get('/main', authCheck, (req, res)=>{ 
        res.render('main', {data: req.user});
    });

    //append a new month history to all tasks
    app.post('/main/updateMonth', (req, res)=>{
        //find user's document by email address
        let conditionEmail = {email: req.user.email};

        //add a new month array
        let curYear = new Date().getFullYear();
        let curMonth = new Date().getMonth();
        let monthDaysNo = daysInMonth(curMonth, curYear);
        let newHistory = {
            year: curYear,
            month: curMonth,
            completed: Array(monthDaysNo).fill(0),
            confirmed: Array(monthDaysNo).fill(false)
        }
    
        //append new month array to all tasks
        for(let i = 0; i<req.user.tasks.length; i++){

            //task to update
            let task = 'tasks.'+i+'.history';
            let toPush = {};
            toPush[task] = newHistory
            let update = {$push: toPush};

            //update individual task
            UserProfile.findOneAndUpdate(conditionEmail, update, (err, data)=>{
                if(err) throw err;
            })
        }

        console.log('here');
        //once done
        res.json({});
    })

    //adding a new task
    app.post('/main', urlencodedParser, (req, res)=>{
        let taskPost = req.body;
        //initializing the history
        let year = new Date().getFullYear(); //year
        let month = new Date().getMonth(); //month
        let monthDaysNo = new Date(year, month+1, 0).getDate(); //number of days in the current month
        let completed = Array(monthDaysNo).fill(0);
        let confirmed = Array(monthDaysNo).fill(false);

        //adding task to database
        let newTask = {
            taskId: req.user.taskNo,
            title: taskPost.title,
            note: taskPost.note,
            stake: taskPost.stake,
            startDate: {
                year: year,
                month: month,
                date: new Date().getDate()
            },
            history: [{
                year: year,
                month: month,
                completed: completed,
                confirmed: confirmed
            }]
        }
        //find user's document by email address
        let conditionEmail = {email: req.user.email};

        //push task
        //then increment no of task count by 1
        let update = {$push: {tasks: newTask}, $inc: {taskNo: 1}};

        UserProfile.findOneAndUpdate(conditionEmail, update, (err, data)=>{
            if(err) throw err;
            res.redirect('main');       
        })
    });

    //changing status of a task
    //note: the url of '/main/complete' does not mean it's just used for updating the completion.
    //failing data will also use this to update 
    app.post('/main/complete', (req, res)=>{
        //getting data in a more convenient form
        let taskId = req.query.taskId;
        let year = req.query.year;
        let month = req.query.month;

        let date = req.query.date;
        let value = req.query.value;

        //update condition
        //use email to find the user
        //use taskId to find the task
        let condition = {email: req.user.email, 'tasks.taskId': taskId};

        //update the completed array 
        //finding the completed and confirmed array
        let completedConfirmedA = completedConfirmedArray(req.user.tasks, taskId, year, month);
        let completedA = completedConfirmedA.completedA;
        completedA[date-1] = value; 
        let update = {'tasks.$.history.0.completed': completedA};

        UserProfile.findOneAndUpdate(condition, update, (err, data)=>{
            if(err) throw err;
            //sending back empty json
            res.json({});
        })

    });

    //confirming the failure of a task
    app.post('/main/confirm', (req, res)=>{
        //getting data in a more convenient form
        let taskId = req.query.taskId;
        let year = req.query.year;
        let month = req.query.month;
        let date = req.query.date;
        let value = req.query.value;

        //update condition
        //use email to find the user
        //use taskId to find the task
        let condition = {email: req.user.email, 'tasks.taskId': taskId};

        //update the completed array 
        //finding the completed and confirmed array
        let completedConfirmedA = completedConfirmedArray(req.user.tasks, taskId, year, month);
        let confirmedA = completedConfirmedA.confirmedA;
        confirmedA[date-1] = value; 
        let update = {'tasks.$.history.0.confirmed': confirmedA};

        UserProfile.findOneAndUpdate(condition, update, (err, data)=>{
            if(err) throw err;
            //sending back empty json
            res.json({});
        })
    });

    
}
