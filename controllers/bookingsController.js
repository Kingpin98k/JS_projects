const catchAsync = require('../utils/catchAsync')
const Bookings = require('../models/bookingsModel')
const factory = require('./handlerFactory')

exports.createBooking = catchAsync(async (req,res,next)=>{
    //Checking if the body contain tour_id and user_id or we have them in params
    //And the id is updated from the loggedIn users data
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id
    // console.log(req.body)
    const booking = await Bookings.create(req.body)
    res.status(201).json({
        status:"Successful",
        booking:booking
    })
})

exports.getAllBookings = catchAsync(async(req,res,next)=>{
    const bookings = await Bookings.find().populate('user').populate({path:'tour',select:'name'})
    res.status(200).send({
        status:"Successful",
        data:bookings
    }) 
})
