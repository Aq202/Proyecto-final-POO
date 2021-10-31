const express = require('express');
const multer = require('multer')


const router = express.Router();

const storage = multer.diskStorage({

    destination:function (req, file, callback) {
        console.log(file);
        callback(null, "./public/resources/profileImages/");

    },

    filename: function (req, file, callback) {
        console.log(file);
        callback(null, Date.now() + "-" + file.originalname);

    }
});

const upload = multer({ storage: storage });

router.post('/uploadFile', upload.any(), (req, res) => {
    console.log(req)
   
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

module.exports = router;