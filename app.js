const express = require("express")
//This will provide our app with an Instance of Express
const app = express()

//This Is Our Custom Error Class
const AppError = require('./utils/appError')

//This is the Global Error Handler Middleware
const globalErrroHandler = require('./controllers/errorController')
//---------------------------------------------------------------------------------------------

//Implementing Morgan Middleware

//Configuring Morgan Logger to be used only in the development Enviornment
if(process.env.NODE_ENV==='development'){
    const morgan = require("morgan")
    app.use(morgan('dev'))
}

app.use(express.json())

//Custom Middleware to set the current ime to request object
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString()
    next()
})

//---------------------------------------------------------------------------------------------
// Creating "Tours" Route for API Version 1


// Synchronously reading the file 
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours_simple.json`,"utf-8"));

// //----------------------------------------------------------------------------------------------

// //1-> GET All TOURS 
// app.get('/api/v1/tours',(req,res)=>{
//    res.status(200).json({
//     "status":"successful",
//     "Request Time":req.requestTime,
//     "results":tours.length,
//     "data":{tours}
//    })
// })

// //2->Get A Specific Tour decided by quaryParams
// app.get('/api/v1/tours/:id',(req,res)=>{
//     //to convert id to number
//     const id = req.params.id*1
    
//     //filtering all the tours with the specified id
//     const tour = tours.filter((elem)=>{
//         if(elem!==null)
//         return elem.id === id
//         return false
//     })
//     if(tour.length===0){
//         res.status(400).json({
//             "status":"Unsuccessful",
//             "message":"Invalid ID"
//         })
//     }
//     else{
//         res.status(200).json({
//             "status":"successful",
//             "data":{
//                 tour
//             }
//         })
//     }
// })

// //3-> Add a new Tour 
// app.post('/api/v1/tours',(req,res)=>{
//     //Generating a new Id and Assigning it to the current object
//     //we colud also do req.body.id = newId but that will modify req.body
//     const newId = tours.length+1;
//     const newTour = Object.assign({id:newId},req.body)

//     //Add new object to tours
//     tours.push(newTour)
    
//     //Add object to our database but after changing format to string using stringify
//     fs.writeFile(`${__dirname}/dev-data/data/tours_simple.json`,JSON.stringify(tours),(err)=>{
//         //Now creating our response-body object
//         res.status(201).json({
//             "status":"success",
//             "data":{
//                 tour:newTour
//             }
//         })
//     }) 
// }) 

// //Patching
// app.patch('/api/v1/tours/:id',(req,res)=>{
//     if(req.params.id*1>tours.length){
//         res.send("Error Invalid Id")
//     }else{
//         res.status(200).json({
//             status:"Successfuly Patched",
//             tour:"<Tours Object Updated>"
//         })
//     }
// })

// //Deleting
// app.delete('/api/v1/tours/:id',(req,res)=>{
//     if(req.params.id*1>tours.length){
//         res.send("Error Invalid Id")
//     }else{
//         delete tours[req.params.id*1]
//         //Now writing into the file again
//         fs.writeFile(`${__dirname}/dev-data/data/tours_simple.json`,JSON.stringify(tours),(err)=>{
//             if(err){
//                 res.status(400).send("Error While deleting ",err)
//             }else{
//                 console.log("Successfully Deleted")
//                 res.status(204).json({
//                     status:"Successfuly Deleted",
//                     data:null
//                 })
//             }
//         })
//     }
// })
//-----------------------------------------------------------------------------------------------



//-----------------------------------------------------------------------------------------------
//Creating "Users" Route for API Version 1  (A new Way Of Coding)
//This router is created in a seperate file under "routes" folder
//We will just import it and use It for USERS CRUD
const userRouter = require('./routes/userRoutes')
const tourRouter = require('./routes/tourRoutes')

//Mounting the router and using it as Middleware
app.use('/api/v1/users',userRouter)
app.use('/api/v1/tours',tourRouter)

//If the program was able to get to "this" point then this means it was not handled by any of the outher route handlers
//Implementing a route handler to handle-unhandled/incorrect routes
app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:"failed",
    //     message:`Can't Find ${req.url}` 
    // })
    //Handling this error using the global error handling middleware
    const err = new AppError(`Can't Find ${req.url}`,404) 
    //This will specifically call the globalErrorHandlingMiddleware
    //Also whatever we pass Into next() express automatically assumes it is an error
    next(err)
})


//Now Implementing A Global Error Handling Middleware:
app.use(globalErrroHandler)

//-----------------------------------------------------------------------------------------------
//Now we will export the express object to keep the server and express functionalities in seperate files
module.exports = app