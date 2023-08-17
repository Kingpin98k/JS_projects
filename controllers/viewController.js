const { default: axios } = require('axios')
const Tour = require('../models/tourModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const Bookings = require('../models/bookingsModel')

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
    const tour = await Tour.findOne({_id:req.params.id}).populate({path:'reviews',fields:'review rating user'})
    
    if(!tour) return next(new AppError("There is no tour with that id !",404))
    res.locals.tour = tour
    res.status(200).render('tour',{
       title:`${tour.name} Tour`,
       tour:tour   //since tour is an array
    })
})

exports.loginUser = catchAsync(async (req,res,next)=>{
   res.status(200).render('login')
})

exports.signupUser = catchAsync(async (req,res,next)=>{
    res.status(200).render('signup',{
        title:"Signup"
    })
})

exports.getAccount = (req,res)=>{
    res.status(200).render('account',{
        title:"Your Account"
    })
}

exports.getMyBookings = catchAsync (async (req,res,next)=>{
    const bookings = await Bookings.find({user:req.user.id})
    
    //This here gives the direct implementation of virtuals
    const tourIds = bookings.map(el=>el.tour)
    const tours = await Tour.find({_id:{$in:tourIds}})
    res.status(200).render('bookings',{
        title:"MyBookings",
        tours:tours
    })
})