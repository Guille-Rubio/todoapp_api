const mongoose = require('mongoose');
require('dotenv');

const configParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslValidate: false,
};



mongoose.connect(process.env.MONGO_DB_CONNECTION, configParams);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Mongo DB Connected successfully");
});







module.exports = mongoose


