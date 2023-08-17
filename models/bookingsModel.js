const mongoose = require('mongoose')

const bookingsSchema = new mongoose.Schema({
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        requie:[true,"A Booking Must have a Tour !!"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        requie:[true,"A Booking Must have a User !!"]
    },
    price:{
        type:Number,
        require:[true,"Booking Must Have a Price !!"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    }
})

// Create a unique compound index on user and tour
bookingsSchema.index({ user: 1, tour: 1 }, { unique: true });

const Bookings = mongoose.model("Bookings",bookingsSchema)

module.exports = Bookings