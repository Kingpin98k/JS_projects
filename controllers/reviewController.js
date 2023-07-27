const Review = require('../models/reviewModel')
const catchAsync = require('../utils/catchAsync')

exports.getAllReviews = catchAsync(async (req,res,next)=>{
   const allReviews = await Review.find()
   res.status(200).json({
    status:"Successful",
    reviews:allReviews
   })
})

exports.createNewReview = catchAsync(async (req,res,next)=>{
    const review = await Review.create(req.body)
    res.status(201).json({
        status:"Successful",
        review:review
    })
})