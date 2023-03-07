const mongoose = require('mongoose');

const notes = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
    },
    note: {
        type: String,
    },
    isCompleted: {
        type: Boolean,
    },
    // tages: [{
    //     type: String,
    // }],
    // sentiment: {
    //     type: String,
    // }
}, { timestamps: true }
);

module.exports = mongoose.model('Notes', notes);