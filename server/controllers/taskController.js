let mongoose = require('mongoose');
let UserProfile = require('../model/userModel.js');
let keys = require('../config/keys');

//connect to mLab database
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true });

module.exports = (app)=>{
    //individual task page
    app.get('/task/:taskId', (req, res)=>{

        //use taskId to find the task
        let taskId = req.params.taskId;
        console.log(taskId);

        //loop through the tasks array to find matching taskId
        for(let i=0; i<req.user.tasks.length; i++){
            if(req.user.tasks[i].taskId == taskId){
                //redirect to task page
                res.render('task', {task: req.user.tasks[i]});
            }
        }
    })

    //deleting a task
    app.delete('/task/delete/:taskId', (req, res)=>{
        
        let delTaskId = req.params.taskId;
        console.log(delTaskId);
        console.log(req.user.email);
        //find user's document by email address
        let conditionEmail = {email: req.user.email};

        //remove task by accessing the taskId
        //then increment no of deleted task count by 1
        let update = {$pull: {tasks: {taskId: delTaskId}}, $inc: {taskDelNo: 1}};

        UserProfile.findOneAndUpdate(conditionEmail, update, (err, data)=>{
            if(err) throw err;
            //send empty data
            res.json({});     
       
        })
    });

}