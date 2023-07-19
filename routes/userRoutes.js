const express = require('express');
const authController = require('../controllers/authController')
//Since we are using MVC Architecture we will have to import the controllers/handlers form "userController"
const userController = require("../controllers/userController");

//----------------------------------------------------------------------------------------------------------------
//Here we create ne Router and Mount it to '/api/v1/users' for handling requests
const userRouter = express.Router();

//----------------------------------------------------------------------------------------------------------------
//Param Middleware to check if the Id is Valid Or Not
userRouter.param('id',userController.validateId);

//Special Route Just for Authentication On Signup/Creation
userRouter.post('/signup',authController.signup)

//1->GetAll/Create-New Users
userRouter.route('/')
.get(userController.getAllUsers)         // Since UserController has the handler to the request event
.post(userController.createNewUser);

//2->Get/Patch/Delete Specific User
userRouter.route('/:id')                 //As the mounting has already been done so just specify the Inner route
.get(userController.getSelectedUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

//Now We will have to Export the router
module.exports = userRouter