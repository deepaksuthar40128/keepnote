const mongoose = require('mongoose');

const remainders = new mongoose.Schema({
    noteId: {
        type: String,
    },
    time: {
        type: Date,
    },
    Action: {
        type: String,
    }
}, { timestamps: true }
);

module.exports = mongoose.model('Remainders', remainders);