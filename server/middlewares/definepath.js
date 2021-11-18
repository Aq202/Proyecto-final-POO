function pathProducts(req,res,next){
    req.imagesPath = "./public/resources/productImages/";
    next();
}

function pathUser(req,res,next){
    req.imagesPath = [];
    req.imagesPath[0] = "./public/resources/userImages/profileImages/";
    req.imagesPath[1] = "./public/resources/userImages/documents/";
    req.contador = 0;
    next();
}

function pathNotifications(req,res,next){
    req.imagesPath = "./public/resources/notificationImages/";
    next();
}

module.exports = {
    pathProducts,
    pathUser,
    pathNotifications,
}