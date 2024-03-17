const express=require('express')
const router=express.Router();
const Product=require('../models/Product')
const { isLoggedIn,isRetailer,isProductAuthor } = require('../middleware');

//list
router.get('/product',async (req,res)=>{
    const products= await Product.find({});
    const message=req.flash('success');
    res.render('products/index',{products,message})
})

//new
router.get('/products/new',isLoggedIn,isRetailer,(req,res)=>{
    res.render('products/new')
})
//create
router.post('/products', isLoggedIn,isRetailer,async (req,res)=>{
    const{name,price,img,desc}=req.body;
    const author=req.user._id
    await Product.create({name,img,price,desc,author})
    req.flash('success','Product created succsessfully')
    res.redirect('/product');
})

//show
router.get('/products/:productid',async(req,res)=>{
    const{productid}=req.params;
    const product=await Product.findById(productid).populate('reviews');
    // console.log(product)
    const message=req.flash('success');
    res.render('products/show',{product,message});
})
//edit
router.get('/products/:productid/edit',isLoggedIn,isRetailer,isProductAuthor,async (req,res)=>{
    const{productid}=req.params;
    const product=await Product.findById(productid);
    res.render('products/edit',{product})
})
//update
router.patch('/products/:productid',isLoggedIn,isRetailer,isProductAuthor,async (req,res)=>{
    const{productid}=req.params;
    const{name,price,img,desc}=req.body;
     await Product.findByIdAndUpdate(productid,{name,img,price,desc});
     req.flash('success', 'Updated the product successfully');
     res.redirect(`/products/${productid}`)

})
//delete
router.delete('/products/:productid',isLoggedIn,isRetailer,isProductAuthor,async(req,res)=>{
    const{productid}=req.params;
    await Product.findByIdAndDelete(productid);
    res.redirect('/product')
})






module.exports=router;