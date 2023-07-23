//This is the User Authentication controller Used when First Creating the User

//Importing Json Web Token
const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require('util')
const sendEmail = require("../utils/sendEmail")
const crypto = require('crypto')

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

exports.login = catchAsync(async (req,res,next)=>{
   const email = req.body.email;
   const password = req.body.password;
    //Check if both the email and passwords are present !!
    if(!email||!password) return next(new AppError("Enter both email and Password !!",404))

    //Check if the input email and password are correct
    const match = await User.findOne({email:email}).select("+password")   //to select the password since it will not be selected implicitely
    if(!match)
      return next(new AppError("Email not present !!",404))

    if(!(await match.comparePasswords(password,match.password))) //using the instance method of user documents
      return next(new AppError("Password Incorrect !!"))

    //Sign and return the JWT
    const token = jwt.sign({id:match._id},process.env.JWT_SECRET,{
      //Expires in
      expiresIn:process.env.JWT_EXPIRES_IN
    })
    res.status(200).json({
       status:"Loged.In Successfully",
       token,
       userName:match.name
    })
})

exports.protect = catchAsync(async (req,res,next)=>{
   let token;
   //1. Getting the token & Checking if it is there with the header??
   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      token = req.headers.authorization.split(' ')[1];
   }else{
      return next(new AppError("You are not LoggedIn please login to get access",401))
   }
   //2. Verification of Token
   const payload = await promisify(jwt.verify)(token,process.env.JWT_SECRET)

   //3. Checking if the user still exists
   const currentUser = await User.findById(payload.id)
   if(!currentUser){
      return next(new AppError("User does not exist signUp to access !!",401))
   } 
   //4. Checking if the user changed password after the token was issued ??
   if(currentUser.isPasswordChangedAfter(payload.iat)){
      return next(new AppError("Password was changed ! Please Login again to continue..",401))
   }
   //We save the current user in the request object for use in later middlewares...If Required !!
   //but this is how we can pass refinde data from one middleware to another sequentially
   req.user = currentUser

   next()
})

exports.forgotPassword = catchAsync(async (req,res,next)=>{
   //1. Get User Based On POSTEmail
   const user = await User.findOne({email:req.body.email})
   if(!user){
      return next(new AppError("User does not exist...!!",400))
   }
   //2. Generate a random reset token
   const resetToken = user.generateResetToken()
   await user.save({validateBeforeSave : false})
    
   //3. Send it to user's email
   const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
   const message = `Forgot you password ? submit a PATCH request to ${resetURL}.\n If you didn't forget your password, please Ignore this message`

   try{
      await sendEmail({
         email:user.email,
         subject:"Your Password Reset token (Valid for 10 mins only)",
         message:message
      })
      res.status(200).json({
         status:"Success",
         message: "Token Sent to email"
      })
   }
   catch(err){
       user.passwordResetToken = undefined
       user.passwordResetExpires = undefined

       await user.save({validateBeforeSave:false})

       return next(new AppError('There was an error while sending the mail try again !!',500))
   }
})

exports.resetPassword = catchAsync (async (req,res,next)=>{
//1) Get the user based on the token
   const hashedUserToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
   const user = await User.findOne({passwordResetToken:hashedUserToken,passwordResetExpires:{$gt:Date.now()}})
   
   //--------------------------------------------------------------------------------------------------------------

//2) If token has not expired and there is a user then set the new password
   if(!user) return next(new AppError("Token is invalid or has already expired !!",400))
   
   //change password and confirm password
   user.password = req.body.password
   user.confirmPassword = req.body.confirmPassword

   //make the passwordReset properties undefined again !!
   user.passwordResetToken = undefined
   user.passwordResetExpires = undefined

   //saving the info but using validation and a presave middleware
   await user.save()

   //--------------------------------------------------------------------------------------------------------------   

//3) Update changedPasswordAt property for the user
   
   //This functionality is made in the pre-save middleware in userModel.js
   //--------------------------------------------------------------------------------------------------------------

//4) Log the user in, send JWT
   //Creating and signing the  webtoken
   const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
      //An option..
      expiresIn:process.env.JWT_EXPIRES_IN
   })

   res.status(201).json({
    status:"Created Succcessfully",
    //Sending the token to the user to save it locally 
    token,
    user:user
   })
})