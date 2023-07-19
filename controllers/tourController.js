//This is the Controller In the MVC architecture and We are adding these functions to the exports object using the (.) pattern

//------------------------------------------------------------------------------------------------------------------------------
const Tour = require('../models/tourModel')

//This is to use filtering features defined in the utils-apiFeatures
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

//This is the error handler for Async Handler functions of the HttpMethods
const catchAsync = require('../utils/catchAsync')

//------------------------------------------------------------------------------------------------------------------------------
//Creating a middleware callback to check if the request body contains price and name properties
// exports.checkBody = (req,res,next)=>{
//     console.log("Now Checking Body")
//     console.log(req.body)
//    if(!req.body.hasOwnProperty('name')){
//         return res.status(400).json({
//         status:"Unsuccessful",
//         message:"No Name Found !"
//      })
//    }
//    if(!req.body.hasOwnProperty('price')){
//         return res.status(400).json({
//         status:"Unsuccessful",
//         message:"No Price Found !"
//      })
//    }
//    next()
// }
//------------------------------------------------------------------------------------------------------------------------------

//Callback Function for param middleware to check for id
// exports.validateId =  (req,res,next,val)=>{
//     if(val>tours.length){
//         return res.status(404).json({
//             status:'Unsuccessful',
//             message:"Id Too Large !"
//         })
//     }
//     next()
// }

//This is for the top-5 tours
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  };

//1-> GET All TOURS 

//All About Catch Async In this Method
exports.getAllTours = catchAsync(async (req, res,next) => {
//Now we can get rid of this try-catch syntax for error handling
//Implementing error handling by passing this whole async function as a parameter to the catchAsync error handler
// try {
  //   // Making the QUERY
  //   const features = new APIFeatures(Tour.find(), req.query)
  //     .filter()                          //these are the filtering features provided in the api
  //     .sort()
  //     .limitFields()
  //     .paginate();

  //   //Executing the query  
  //   const tours = await features.query;

  //   // SEND RESPONSE
  //   res.status(200).json({
  //     status: 'success',
  //     results: tours.length,
  //     data: {
  //       tours
  //     }
  //   });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   });
// }
//-----------------------------------------------------------------------------------------------------------------
    // Making the QUERY
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()                          //these are the filtering features provided in the api
    .sort()
    .limitFields()
    .paginate();

  //Executing the query  
  const tours = await features.query;
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});


//2->Get A Specific Tour decided by quaryParams
exports.getSelectedTours = catchAsync(async (req,res,next)=>{
  const selectedTour = await Tour.findById(req.params.id)
  
  //If the tourId does not match mongoDb sets data to null and response code is 200 
  //but we want to set it to 404 
  if(!selectedTour){
    return next(new AppError('No Tour found with that ID', 404))  //We are returninghere to prevent code to move to next line and send 2-responses
  }

  res.status(200).json({
    status:"Successful",
    tour:selectedTour
  })
})

//3-> Add a new Tour 
exports.createNewTour = catchAsync(async (req,res,next)=>{
    //Generating a new Id and Assigning it to the current object
    //we colud also do req.body.id = newId but that will modify req.body
    const newTour = await Tour.create(req.body)
    res.status(201).json({
    "status":"successful",
    "Request Time":req.requestTime,
    "data":{tour:newTour}
   })
})

//Patching
exports.updateTours = catchAsync(async (req,res,next)=>{
     const patchedTour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
  //If the tourId does not match mongoDb sets data to null and response code is 200 
  //but we want to set it to 404 
  if(!patchedTour){
    return next(new AppError('No Tour found with that ID', 404))  //We are returninghere to prevent code to move to next line and send 2-responses
  }
        res.status(200).json({
            status:"Successful",
            data:patchedTour
        })
})

//Deleting
exports.deleteTours = catchAsync(async (req,res,next)=>{
  const deleatedTour = await Tour.findByIdAndDelete(req.params.id)
  
  //If the tourId does not match mongoDb sets data to null and response code is 200 
  //but we want to set it to 404 
  if(!deleatedTour){
    return next(new AppError('No Tour found with that ID', 404))  //We are returninghere to prevent code to move to next line and send 2-responses
  }

  res.status(200).json({
      status:"Successful",
      deleted_tour:deleatedTour
  })
})