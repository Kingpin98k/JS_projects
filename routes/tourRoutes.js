const express = require('express')

//Since we are using MVC Architecture we will have to import the controllers/handlers form "userController"
const tourController = require("../controllers/tourController")

//----------------------->>NESTED ROUTES<<---------------------------------------------//
                                                                                       //
//Importing authController ans reviewController to implement Nested Routes             //
const authController = require('../controllers/authController')                        //
//const reviewController = require('../controllers/reviewController')                  //
                                                                                       //
//Now For implementing nested routes we are using mergeParams and router mounting      //
const reviewRouter = require('./reviewRoutes')                                         //
                                                                                       //
//----------------------->>NESTED_ROUTES_END<<-----------------------------------------//

//----------------------------------------------------------------------------------------------------------------
//Here we create tne Router and will Mount it to '/api/v1/tours' for handling requests
const tourRouter = express.Router()

//----------------------------------------------------------------------------------------------------------------
// Creating "Tours" Route for API Version 1

//Param Middleware to check if the Id is Valid Or Not
//tourRouter.param('id',tourController.validateId)

//Special route for toursWithin a given radius from the given location
tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit')
.get(tourController.getToursWithin);

//Alias Route to search for top 5 tours fast 
tourRouter
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

//1->GetAll/Create-New Tours
tourRouter.route('/')
.get(tourController.getAllTours)         // Since UserController has the handler to the request event
.post(tourController.createNewTour)

//2->Get/Patch/Delete Specific Tour
tourRouter.route('/:id')                 //As the mounting has already been done so just specify the Inner route
.get(tourController.getSelectedTours)
.patch(tourController.updateTours)
.delete(tourController.deleteTours)


//Implementing Nested Tour Routes for tours/_id/reviews
// tourRouter.route('/:tourId/reviews')
// .post(authController.protect,reviewController.createNewReview)
// .get(reviewController.getAllReviews)

//For Nested Routes
tourRouter.use('/:tourId/reviews',reviewRouter)

//Now We will have to Export the router
module.exports = tourRouter