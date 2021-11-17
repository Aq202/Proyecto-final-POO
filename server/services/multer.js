const multer = require('multer')

const storage = multer.diskStorage({

    destination:function (req, file, callback) {
        callback(null, req.imagesPath);
    },

    filename: function (req, file, callback) {
        let newFilename = Date.now()+"-"+file.originalname;
        let contador = 0;
        callback(null, newFilename);
        if(req.imagesUrl == undefined)
            req.imagesUrl = [];
        req.imagesUrl.push(req.imagesPath + newFilename);
    }
});

module.exports = multer({ storage: storage });


