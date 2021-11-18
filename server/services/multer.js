const multer = require('multer')

const storage = multer.diskStorage({

    destination:function (req, file, callback) {
        if(req.contador == 0){
            callback(null, req.imagesPath[req.contador]);
            req.contador += 1;
        }else if(req.contador == undefined)
            callback(null, req.imagesPath[req.contador]);
        else
        callback(null, req.imagesPath[req.contador]);
    },

    filename: function (req, file, callback) {
        console.log(file);
        let newFilename = Date.now()+"-"+file.originalname;
        callback(null, newFilename);
        if(req.imagesUrl == undefined)
            req.imagesUrl = [];
        req.imagesUrl.push(req.imagesPath + newFilename);
    }
});

module.exports = multer({ storage: storage });


