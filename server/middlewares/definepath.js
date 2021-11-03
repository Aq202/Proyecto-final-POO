function pathProducts(req,res,next){
    req.imagesPath = "./public/resources/productImages/";
    next();
}

function pathUsers(req,res,next){
    req.imagesPath = "./public/resources/profileImages/";
    next();
}

module.exports = {
    pathProducts,
    pathUsers
}