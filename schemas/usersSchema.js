const { UUID } = require('bson');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const uuid = require('uuid');


const users = new Schema({
    id: { type: String, default: () => uuid.v4() },
    email: String,
    name: String

});

const Users = mongoose.model('Users', users);

module.exports = Users;