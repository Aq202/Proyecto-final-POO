const multer = require('multer')

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

module.exports = multer({ storage: storage });


