let mongoose = require('mongoose');

//Schema 
//Schema for history
let historySchema = new mongoose.Schema({
    year: Number,
    month: Number,
    completed: [Number],
    confirmed: [{type: Boolean, default: false}]
})
//Schema for date
let dateSchema = new mongoose.Schema({
    year: Number,
    month: Number,
    date: Number
})

//Schema for each task
let tasksSchema = new mongoose.Schema({
    taskId: Number,
    title: String,
    note: String,
    stake: Number,
    startDate: dateSchema,
    history: [historySchema]
})

//Schema for a user
let userSChema = new mongoose.Schema({
    userID: {type: String, required: true},
    username: {type: String, required: true},
    email: String,
    taskNo: {type: Number, default: 0},
    taskDelNo: {type: Number, default: 0},
    tasks: [tasksSchema]
})

//Model
module.exports = mongoose.model('UserProfile', userSChema);