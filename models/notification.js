const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Notification = new Schema({
    message: {
        type: String
    }
    ,
    data: {
        type: String
    }
    ,
    senderId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ,
    receiverId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ,
    readAt: {
        type: Date,
        default: null
    },

}, {timestamps: true});


module.exports = mongoose.model('Notification', Notification);


