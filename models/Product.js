const mongoose=require('mongoose');

const productSchema= new mongoose.Schema({
    name:String,
    desc:String,
    price:Number,
    img:String,
    reviews: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const Product=mongoose.model('Product',productSchema);

module.exports=Product;