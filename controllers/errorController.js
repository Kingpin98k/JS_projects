//This is The GlobalErrorHandler Middleware
//Simply import this in any module and use it...

const AppError = require('../utils/appError');

//-------------------------------------------------------------------------------------------
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name;
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('/ ')}`;
  return new AppError(message, 400);
};

//Both the errors while verifying the JWT
const handleJsonWebTokenError = err => new AppError("Invalid token Please Login again !!",401)

const handleTokenExpiredError = err=> new AppError("Token Expired Please Login again !!",401)
//-------------------------------------------------------------------------------------------
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error:err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

  // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  //Sometimes some internal node errors may not have a status code 
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //Creating a new error object using err and Object Destructuring
    let error = { ...err };

    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message === 'Validation failed') error = handleValidationErrorDB(error);
    //JWT Verification Errors
    if(error.name === "JsonWebTokenError") error = handleJsonWebTokenError(error)
    if(error.name === "TokenExpiredError") error = handleTokenExpiredError(error)
    sendErrorProd(error, res);
  }
};

//Seperating Error Outputs for Development and Production Enviornment
//We need to send Less Info to the Client about the error


//Also we need to send only Operational errors to the Client and Not the Programatic errors/Logical Errors
//We Will do that using isOperational property of the AppError Class

//We need to mark some errors thrown by mongoose as Operational errors
//1. Get request using a wrong id-format i.e. not understandable by mongoose (Cast Error)
//2. Post request to an already existing Object
//3. Patch request which may generate a validation-error (ValidationError)
//....
