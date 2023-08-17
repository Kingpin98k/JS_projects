const express = require('express')
const authController = require('../controllers/authController')
const bookingsController = require('../controllers/bookingsController')

const bookingRouter = express.Router({mergeParams:true})

bookingRouter.route('/')
.get(bookingsController.getAllBookings)
.post(authController.protect,bookingsController.createBooking)

module.exports = bookingRouter