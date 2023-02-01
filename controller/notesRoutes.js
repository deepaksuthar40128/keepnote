const express = require('express');
const app = express();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    // } else {
    //     cb(null, false);
    // }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
});

app.post('/save-img', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.status(200).send({ link: `uploads/${req.file.filename}` });
});


app.post('/saveNote', (req, res) => {
    console.log(req.body.text);
    console.log(req.user);
});

module.exports = app;