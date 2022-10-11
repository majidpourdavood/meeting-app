const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    startDate: {
        type: Date,
        default: null
    }, endDate: {
        type: Date,
        default: null
    },
    userId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ,
}, {timestamps: true});


module.exports = mongoose.model('Meeting', MeetingSchema);
