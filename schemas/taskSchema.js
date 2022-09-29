const mongoose = require('mongoose');
const { Schema } = mongoose;

const task = new Schema({
    task: String, // String is shorthand for {type: String}
    position: Number,
    completed: Boolean,
    date: { type: Date },

});

const Task = mongoose.model('Task', task);

module.exports = Task;