const multer = require('multer')

const storage = multer.diskStorage({

    destination:function (req, file, callback) {
        callback(null, req.productsPath);
    },

    filename: function (req, file, callback) {
        let newFilename = Date.now()+"-"+file.originalname;
        callback(null, newFilename);
        if(req.imagesUrl == undefined)
            req.imagesUrl = [];
        req.imagesUrl.push(req.productsPath + newFilename);
    }
});

module.exports = multer({ storage: storage });


