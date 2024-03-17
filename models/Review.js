const mongoose =require('mongoose')

const reviewSchema=mongoose.Schema({
    comments:String,
    rating:Number,
    author:String
})


const Review=mongoose.model('Review',reviewSchema);



module.exports=Review;