const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    body: {
        type: String
    },
    mobile: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        // unique: true,
    },


}, {timestamps: true});


module.exports = mongoose.model('User', userSchema);
