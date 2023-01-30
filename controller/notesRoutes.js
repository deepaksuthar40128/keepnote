const express = require('express');
const app = express();
const notes = require('../model/notes');
const multer = require('multer');

app.post('/saveNote', (req, res) => {
    console.log(req.body.text);
    console.log(req.user);
})

app.post('/save-img', (req,res) => {
    console.log("req.body.image");
    console.log(req.file);
    res.status(200).send({ link: 'abc.com' });
})


module.exports = app;