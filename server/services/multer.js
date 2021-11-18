const multer = require('multer')

const storage = multer.diskStorage({
    destination:function (req, file, callback) {
        if(req.contador == 0){
            callback(null, req.imagesPath[0]);
            req.contador = 2
        }else if(req.contador == undefined)
            callback(null, req.imagesPath);
        else
            callback(null, req.imagesPath[1]);
    },

    filename: function (req, file, callback) {
        let newFilename = Date.now()+"-"+file.originalname;
        callback(null, newFilename);
        if(req.contador == 1){
            if(req.imagesUrl == undefined)
                req.imagesUrl = [];
            req.imagesUrl.push(req.imagesPath[1] + newFilename);
            req.contador = 2;
        }else if(req.contador == undefined){
            if(req.imagesUrl == undefined)
                req.imagesUrl = [];
            req.imagesUrl.push(req.imagesPath + newFilename);
        }else{
            if(req.imagesUrl == undefined)
                req.imagesUrl = [];
            req.imagesUrl.push(req.imagesPath[0] + newFilename);  
        }
    }
});

module.exports = multer({ storage: storage });


