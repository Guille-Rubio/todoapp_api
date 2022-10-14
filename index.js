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

app.use(session({secret:'SECRET'}));
app.use(passport.initialize());
app.use(passport.session());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan(':method :host :status :param[id] - :response-time ms :body'));

app.use('/google', googleRouter);

app.get('/', async (req, res) => {
    try {
        const all = await Task.find({})
        res.status(200).json(all);

    } catch (e) {
        res.status(400).json({ msg: "bad request" });
    }
});

app.post('/', async (req, res) => {
    try {
        const newTask = req.body;
        const newTaskSaved = await Task.create(newTask);
        res.status(200).json(newTaskSaved);
    } catch (e) {
        res.status(400).json({ msg: "bad request" });
    }

});

app.put('/', async (req, res) => {
    try {
        const update = req.body;
        const { id } = update;
        const filter = { id: id };
        let editedTask = await Task.findOneAndUpdate(filter, update, { returnOriginal: false });
        res.status(200).json(editedTask);
    } catch (e) {
        res.status(400).json({ msg: "bad request" });
    }
});

app.delete('/', async (req, res) => {
    try {
        const { id } = req.body;
        const deleted = await Task.deleteOne({ id: id });
        res.status(200).json({ msg: `Task ${req.body.position} deleted`, deleted: deleted });
    } catch (e) {
        res.status(400).json({ msg: "bad request" });
    }
});

app.delete('/all', async (req, res) => {
    try {
        await Task.deleteMany({});
        res.status(200).json({ msg: `All tasks deleted` })

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});