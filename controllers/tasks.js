const Task = require('../schemas/taskSchema');
const tokens = require('../utils/tokens');


const getAllUserTasks = async (req, res) => {
    try {
        if (req.headers.cookie.indexOf('access-token') !== -1) {
            const { cookie } = req.headers;
            const accessToken = cookie.slice(cookie.indexOf("=") + 1, cookie.indexOf(";"));
            const email = await tokens.decodeToken(accessToken).email;
            const all = await Task.find({ email: email });
            res.status(200).json(all);
        }
        else {
            res.status(401);
        }

    } catch (e) {
        res.status(400).json({ msg: "bad request" });
    }
};

const createTask = async (req, res) => {

    try {
        const { cookie } = req.headers;
        const accessToken = cookie.slice(cookie.indexOf("=") + 1, cookie.indexOf(";"));
        const email = await tokens.decodeToken(accessToken).email;
        const newTask = { ...req.body, email };
        const newTaskSaved = await Task.create(newTask);
        res.status(200).json(newTaskSaved);
    } catch (e) {
        console.log(e);
        res.status(400).json({ msg: "bad request" });
    }
};

const editTask = async (req, res) => {
    try {
        const update = req.body;
        const { id } = update;
        const filter = { id: id };
        let editedTask = await Task.findOneAndUpdate(filter, update, { returnOriginal: false });
        res.status(200).json(editedTask);
    } catch (e) {
        res.status(400).json({ msg: "bad request" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.body;
        const deleted = await Task.deleteOne({ id: id });
        res.status(200).json({ msg: `Task ${req.body.position} deleted`, deleted: deleted });
    } catch (e) {
        res.status(400).json({ msg: "bad request" });
    }
};

const deleteAllTasks = async (req, res) => {
    try {
        await Task.deleteMany({});
        res.status(200).json({ msg: `All tasks deleted` })

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};


const tasks = {
    getAllUserTasks,
    createTask,
    editTask,
    deleteTask,
    deleteAllTasks
};

module.exports = tasks;