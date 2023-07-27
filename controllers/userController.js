//This is the Controller In the MVC architecture and We are adding these functions to the exoports object using the (.) pattern

const catchAsync = require("../utils/catchAsync")
const User = require('../models/userModel')
const AppError = require("../utils/appError")

//Callback Function for param middleware to check for id
exports.validateId =  (req,res,next,val)=>{
   console.log("Now Printing -> ",val)
   next()
}

exports.getAllUsers = catchAsync(async (req,res)=>{
  const allUsers = await User.find()
  res.status(200).json({
    status:"Successful",
    users:allUsers
  })
})

//Function for filtering data before updating user's Info so that only allowed fields are Included
const filterObj = (obj,...fields)=>{
  const newObj = {}
  Object.keys(obj).forEach(el=>{
    if(fields.includes(el)){
      newObj[el] = obj[el]
    }
  })
  return newObj
}

//This is a handler for the loggedIn user to update his own credentials such as email and name etc.
exports.updateMe = catchAsync(async (req,res,next)=>{
  //1) Create error if user posts password data :
  if(req.body.password||req.body.confirmPassword) return next(new AppError("This route is not for password updates please use Patch to reaset Password",400))
  //2) Update user document
  const filteredObj = filterObj(req.body,"name","email")
  const user  = await User.findByIdAndUpdate(req.user.id,filteredObj,{
    runValidators:true,
    new:true
  }) //this id we are getting from the user object that we attached to request object
  res.status(202).json({
    status:"Successfully Updated",
    user:user
  })
})

//This is a handler for letting the LoggedIn user set his account to inactive
exports.deleteMe = catchAsync (async(req,res,next)=>{
  //we are setting active as false here
  //we also need to make a query middleware such that each time someone queries with a find at start we only send them the users whicg are active
  //so we make this query middleware in userModel.js
   await User.findByIdAndUpdate(req.user.id,{$set:{active:false}})
   res.status(204).json({
    status:"Successfully Deleted"
   })
})

exports.createNewUser = (req,res)=>{
    res.send("Not Yet Created")
}
exports.getSelectedUser = (req,res)=>{
    res.send("Not Yet Created")
}
exports.updateUser = (req,res)=>{
    res.send("Not Yet Created")
}
exports.deleteUser = (req,res)=>{
    res.send("Not Yet Created")
}