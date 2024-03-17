const Product=require('./models/Product')
const Review=require('./models/Review')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to login first');
        return res.redirect('/login');
    }
    next();
}

module.exports.isRetailer = (req, res, next) => {
    if (req.user.userType === 'retailer') {
        return next();
    }
    req.flash('error', 'You are not authorised to do that');
    res.redirect('/product');
}

module.exports.isProductAuthor = async(req, res, next) => {
    const { productid } = req.params;
    const product = await Product.findById(productid);

    if (product.author && product.author.equals(req.user._id)) {
        return next();
    }
    req.flash('error', 'You are not authorised to do that');
    res.redirect('/products');
}


module.exports.hadCommented=async(req,res,next)=>{
    const {productid,reviewid}=req.params;
     const review=await Review.findById(reviewid);
     if( review.author&&!(req.user.username===review.author)){
        req.flash('error','Cannot delete comment')
        return  res.redirect(`/products/${productid}`)
       
     }
     next();
}