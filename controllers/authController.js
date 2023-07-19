//This is the User Authentication controller Used when First Creating the User

//Importing Json Web Token
const jwt = require('jsonwebtoken')

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.signup = catchAsync(async (req,res,next)=>{
   //Create the user with only required fields form the body to keep anyone from defining the role as admin
   const newUser = await User.create({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      confirmPassword:req.body.confirmPassword
   })

   //Creating and signing the  webtoken
   const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
      //An option..
      expiresIn:process.env.JWT_EXPIRES_IN
   })

   res.status(201).json({
    status:"Created Succcessfully",
    //Sending the token to the user to save it locally 
    token,
    user:newUser
   })
})