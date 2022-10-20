const express = require('express');
require('dotenv').config();
require('./config/mongoDBconnection');
require('./config/googleAuth');
const morgan = require('./config/morganConfig');
const app = express();
const session = require('express-session');


const passport = require('passport');
const port = 5000;
const Task = require('./schemas/taskSchema');
const cors = require('cors');


const googleRouter = require('./routes/google');
const taskRouter = require('./routes/tasks');


app.use(session({ secret: process.env.MY_SECRET }));
app.use(passport.initialize());
app.use(passport.session());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(morgan(':method :url :host :status :param[id] - :response-time ms :body'));

app.use('/google', googleRouter);
app.use('/tasks', taskRouter);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});