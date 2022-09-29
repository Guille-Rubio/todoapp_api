const express = require('express');
require('dotenv').config();
require('./config/mongoDBconnection');
const app = express();
const port = 5000;
const Task = require('./schemas/taskSchema');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
        await Task.create(newTask);
        res.status(200).json({ created: newTask });
    } catch (e) {
        res.status(400).json({ msg: "bad request" });
    }

});

app.put('/', async (req, res) => {
    try {
        const update = req.body;
        const { position } = update;
        const filter = { position: position };
        let editedTask = await Task.findOneAndUpdate(filter, update, { returnOriginal: false });
        res.status(200).json(editedTask);
    } catch (e) {
        res.status(400).json({ msg: "bad request" });
    }
});

app.delete('/', async (req, res) => {
    try {
        const { position } = req.body;
        const deleted = await Task.deleteOne({ position: position });
        res.status(200).json({ msg: `Task ${req.body.position} deleted`, deleted: deleted });
    } catch (e) {
        res.status(400).json({ msg: "bad request" });
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});