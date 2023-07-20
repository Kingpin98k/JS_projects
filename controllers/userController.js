//This is the Controller In the MVC architecture and We are adding these functions to the exoports object using the (.) pattern

const catchAsync = require("../utils/catchAsync")
const User = require('../models/userModel')

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