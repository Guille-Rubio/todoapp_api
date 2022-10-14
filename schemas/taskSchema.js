const { UUID } = require('bson');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const uuid = require('uuid');


const task = new Schema({
    title: String, // String is shorthand for {type: String}
    position: Number,//Set default number? 
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    id: { type: String, default: () => uuid.v4() }

});

const Task = mongoose.model('Task', task);

module.exports = Task;