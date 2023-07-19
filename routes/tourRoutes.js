const express = require('express')

//Since we are using MVC Architecture we will have to import the controllers/handlers form "userController"
const tourController = require("../controllers/tourController")

//----------------------------------------------------------------------------------------------------------------
//Here we create tne Router and will Mount it to '/api/v1/tours' for handling requests
const tourRouter = express.Router()

//----------------------------------------------------------------------------------------------------------------
// Creating "Tours" Route for API Version 1

//Param Middleware to check if the Id is Valid Or Not
//tourRouter.param('id',tourController.validateId)

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

//Now We will have to Export the router
module.exports = tourRouter