const express = require('express');
require('dotenv').config();
require('./config/mongoDBconnection');
require('./config/googleAuth');
const morgan = require('./config/morganConfig');
const app = express();
const session = require('express-session');

const tokens = require('./utils/tokens');


const passport = require('passport');
const baseUrl = require('./utils/environment');
const port = process.env.PORT || 5000;
const Task = require('./schemas/taskSchema');
const cors = require('cors');


const googleRouter = require('./routes/google');
const taskRouter = require('./routes/tasks');


app.use(session({ secret: process.env.MY_SECRET }));
app.use(passport.initialize());
app.use(passport.session());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: `${baseUrl}` }));
app.use(morgan(':method :url :host :status :param[id] - :response-time ms :body'));

app.use('/google', googleRouter);
app.use('/tasks', taskRouter);

app.get('/active-user', async (req, res) => {
    try {
        if (req.headers.cookie.indexOf('access-token') !== -1) {
            const { cookie } = req.headers;
            const accessToken = cookie.slice(cookie.indexOf("=") + 1, cookie.indexOf(";"));
            const email = await tokens.decodeToken(accessToken).user;
            res.status(200).json(email);
        }
        else {
            res.status(401)
        }

    } catch (error) {
        res.status(400).json({ msg: "no active user" })
    }
})

app.get('/', (req, res) => {
    res.status(200).json({ msg: "Up and running!" })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});