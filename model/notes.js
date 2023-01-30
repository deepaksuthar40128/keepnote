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
    tages: [{
        type: String
    }],
}, { timestamps: true }
);

module.exports = mongoose.model('Notes', notes);