const express=require('express');
const router=express.Router();
const Review=require('../models/Review')
const Product=require('../models/Product')
const{ isLoggedIn,hadCommented}=require('../middleware')

router.post('/products/:productid/reviews',isLoggedIn,async(req,res)=>{
     const{productid}=req.params;
     const {rating ,comments}=req.body;
    const {username}=req.user
    
     const product = await Product.findById(productid).populate('reviews');
     console.log(product.reviews)
     const hasCommented=product.reviews.find((item)=>item.author===username);
     if(hasCommented){
        req.flash('error',"You had already commented")
       return  res.redirect(`/products/${productid}`)
        
     }
     const author=username;
     const review= await Review.create({rating ,comments,author});

     product.reviews.push(review._id);//here if we push review also it will work

    await product.save();
    res.redirect(`/products/${productid}`)

})

router.delete('/products/:productid/reviews/:reviewid',isLoggedIn,hadCommented,async(req,res)=>{
    try{
     const {productid,reviewid}=req.params;
     const product= await Product.findById(productid).populate('reviews');
     const updatedReview=product.reviews.filter((item)=>!item._id.equals(reviewid));
     product.reviews=updatedReview;

     


     console.log(productid+" "+reviewid)
     await Review.findByIdAndDelete(reviewid);
     await product.save();
     res.redirect(`/products/${productid}`)
    }
    catch(e){
        req.flash('error','Cannot delete comment')
        res.redirect(`/products/${productid}`)
    }
})








module.exports=router;