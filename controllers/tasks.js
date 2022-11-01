const Task = require('../schemas/taskSchema');
const tokens = require('../utils/tokens');


const getAllUserTasks = async (req, res) => {
    try {
        if (req.headers.cookie.indexOf('access-token') !== -1) {
            const { cookie } = req.headers;
            const accessToken = cookie.slice(cookie.indexOf("=") + 1, cookie.indexOf(";"));
            const email = await tokens.decodeToken(accessToken).email;
            const all = await Task.find({ email: email }).sort({position:"asc"});
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

const editTaskPosition = async (req, res) => {
    try {
        const { cookie } = req.headers;
        const accessToken = cookie.slice(cookie.indexOf("=") + 1, cookie.indexOf(";"));
        const email = await tokens.decodeToken(accessToken).email;
        const { dragItem, dragOverItem } = req.body;
        console.log("dragItem ", dragItem, "dragOverItem ", dragOverItem)

        let draggedItem;
        let movedItems;

        if (dragItem < dragOverItem) {
            //Actualiza posicion del item arrastrado
            draggedItem = await Task.findOneAndUpdate(
                { email: email, position: dragItem },
                { position: dragOverItem },
                { new: true });

            movedItems = await Task.updateMany(
                {
                    id: { $ne: draggedItem.id },
                    email: email,
                    position: {
                        $gt: dragItem,
                        $lte: dragOverItem
                    }
                },
                { $inc: { position: -1 } },
                { new: true });
        }

        if (dragItem > dragOverItem) {
            draggedItem = await Task.findOneAndUpdate(
                { email: email, position: dragItem },
                { position: dragOverItem },
                { new: true });

            movedItems = await Task.updateMany(
                {
                    id: { $ne: draggedItem.id },
                    email: email,
                    position: {
                        $gte: dragOverItem,
                        $lte: dragItem
                    }
                },
                { $inc: { position: 1 } },
                { returnOriginal: false });
        }

        res.status(200).json({ draggedItem, movedItems });

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: "bad request" });
    }
}

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
    editTaskPosition,
    deleteTask,
    deleteAllTasks
};

module.exports = tasks;