const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')

exports.getOverview = catchAsync(async (req,res,next)=>{
    //1. Get the Tour Data from the collection
    const tours = await Tour.find()
    //2. Build Templat
    //3. Render the temlpate using tour data 

    res.status(200).render('overview',{
        title:"All Tours",
        tours:tours
    })
})

exports.getTour = catchAsync(async (req,res,next)=>{

    //1.Get the tour-data along with (tour-guides and reviews)
    //we have populated guides in the tourmodel itself so we need not to polulate it again
    const tour = await Tour.find({_id:req.params.id}).populate('reviews')
    res.status(200).render('tour',{
       title:`${tour[0].name} Tour`,
       tour:tour[0]   //since tour is an array
    })
})

exports.loginUser = catchAsync(async (req,res,next)=>{
   res.status(200).render('login')
})

