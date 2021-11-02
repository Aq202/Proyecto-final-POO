function pathProducts(req,res,next){
    req.productsPath = "./public/resources/productImages/";
    next();
}

function pathUsers(req,res,next){
    req.productsPath = "./public/resources/profileImages/";
    next();
}

module.exports = {
    pathProducts,
    pathUsers
}