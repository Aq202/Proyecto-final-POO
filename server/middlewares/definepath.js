function pathProducts(req,res,next){
    req.imagesPath = "./public/resources/productImages/";
    next();
}

function pathProfile(req,res,next){
    req.imagesPath = "./public/resources/userImages/profileImages/";
    next();
}

function pathNotifications(req,res,next){
    req.imagesPath = "./public/resources/notificationImages/";
    next();
}

function pathDPI(req,res,next){
    req.imagesPath = "./public/resources/userImages/dpiImages/";
    next();
}

module.exports = {
    pathProducts,
    pathProfile,
    pathNotifications,
    pathDPI
}