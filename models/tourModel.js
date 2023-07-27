//This is The Model for tours in our MVC architecture
const mongoose = require('mongoose')

//We are Importing User model to store the data of guides if we use "embedding"
const User = require('./userModel')

//Defining Schema For the Data Model which will then be used as a template to create Documents for MongoDB
const tourSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters']
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
      },
      slug: String,
      duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
      },
      maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
      },
      difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
          values: ['easy', 'medium', 'difficult'],
          message: 'Difficulty is either: easy, medium, difficult'
        }
      },
      ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
      },
      ratingsQuantity: {
        type: Number,
        default: 0
      },
      price: {
        type: Number,
        required: [true, 'A tour must have a price']
      },
      priceDiscount: {
        type: Number,
        validate: {
          validator: function(val) {
            // this only points to current doc on NEW document creation
            return val < this.price;
          },
          message: 'Discount price ({VALUE}) should be below regular price'
        }
      },
      summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
      },
      description: {
        type: String,
        trim: true
      },
      imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
      },
      images: [String],
      createdAt: {
        type: Date,
        default: Date.now(),
        select: false
      },
      startDates: [Date],
      secretTour: {
        type: Boolean,
        default: false
      },
      startLocation:{
        // GeoJSON
        type:{
          type: String,
          //Geometry 
          default: 'Point',
          //Array of only available options (enum)
          enum : ['Point']
        },
        coordinates:[Number],  //First Longitude then the Latitude (Contradictory of general case)
        //These fields are optionl and are not required to make this a GeoJSON pattern
        address:String,
        description:String
      },
      //Creating an embedded document of Locations
      // It is an array of GeoJSON objects
      //We can do "geolocation queries" using this GeoJSON object 
      locations:[{
        type:{
          type:String,
          default:"Point",
          enum:["Point"]
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
      }
    ],
    //Refrencing the user data (Guides) into our tour model
    guides:[{
      type:mongoose.Schema.ObjectId,  //type should be a mongodb id
      ref:'User' // This is how we reference to different data models in mongodb
      //We do not need to also import User in the current module
    }]
    }, 
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  )
  
/*Embedding Guides
  //This is to embed the user(Guide) into the corrosponding tour document
  // tourSchema.pre('save',async function(next){
  //   const guidesPromises = this.guides.map(async guide=>{
  //     await User.findById(guide)
  //   })
  //   this.guides = await Promise.all(guidesPromises)
  //   next()
 })
 */

//-------------------------------> REFERENCDE <-----------------------------------------
//Creating a query Middleware to populate the Referenced data before sending the output
tourSchema.pre(/^find/,function(next){
  //We can also pass an object specifying to select only certain fields in the output !!
  this.populate({path:'guides',select:'-__v -passwordChangedAt'})
  next()
})

//------------------------------->>VIRTUAL POPULATION<<----------------------------------------------
//Virtually populating the reviews everytime someone querys for "a particular" tour :
//Also to start populating we have to add .populate('path : reviews') in the tourController when we query for a specific tour 
tourSchema.virtual('reviews',{
  ref:'Review',
  //Match value of my "localField" with the value contained in reference's(Review) "foreignField"
  foreignField:'tour', //reference's foreign field
  localField:'_id'  //tours local field
})

//Creating the Model Out of the Schema
const Tour = mongoose.model("Tour",tourSchema)
 
//Now we will export the Tour model to the controller for using 
module.exports = Tour