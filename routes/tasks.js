const express = require('express');
const taskRouter = express();
const tasks = require('../controllers/tasks');

taskRouter.get('/', tasks.getAllUserTasks);
taskRouter.post('/', tasks.createTask);
taskRouter.put('/', tasks.editTask);
taskRouter.post('/edit-positions', tasks.editTaskPosition)
taskRouter.delete('/', tasks.deleteTask);
taskRouter.delete('/all', tasks.deleteAllTasks);

module.exports = taskRouter;