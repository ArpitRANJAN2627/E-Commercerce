const express=require('express')
const router=express.Router();
const User=require('../models/User')
const Product=require('../models/Product');
const { isLoggedIn } = require('../middleware');


router.get('/products/user/cart',isLoggedIn,async(req,res)=>{
    try{
    const cart=req.user.cart;
    const totalAmount=cart.reduce((sum,item)=>{
        return sum+item.price*item.count;
    },0)
    res.render('cart/cartPage',{cart,totalAmount})
}
catch(e){
    req.flash('error',"Something Went Wrong")
    res.redirect('/product')
}
})





router.post('/products/:productid/cart',isLoggedIn,async(req,res)=>{
    try{

    const {productid}=req.params;
    const userid=req.user._id;
    const user=await User.findById(userid);
    const product=await Product.findById(productid);

    const isPresent = user.cart.some((item) => item.id.equals(productid));

        // if present then we will only update the count
        // otherwise we will add a new product altogther

        if (isPresent) {
            const updateCart = user.cart.map((item) => item.id.equals(productid) ? { ...item, count: item.count + 1 } : item);
            user.cart = updateCart;
        }
    else{

    user.cart.push(
        {
            name:product.name,
            img:product.img,
            price:product.price,
            id:product._id
        }
    )
    }
    await user.save();
    res.redirect("/products/user/cart")

    }
    catch(e){
        req.flash('error',"Cannot create product at the moment")
        res.redirect('/product');
    }
})

router.patch('/products/:productid/cart',isLoggedIn,async(req,res)=>{
    try{
        const {productid}=req.params;
     
        const userid=req.user._id;
        const user=await User.findById(userid);
        // const product=await Product.findById(productid);
        const updateCart = user.cart.filter((item)=> { 
            if(item.id.equals(productid))
        // console.log(`${item.id}  ${productid}`)
        return  !(item.id.equals(productid)) });
        user.cart = updateCart;
       // console.log(user.cart)
       await user.save();
        res.redirect('/products/user/cart');
    }
    catch(e){
        req.flash('error',"Cannot Delete product at the moment")
        res.redirect('/products/user/cart');
    }
})















module.exports=router;