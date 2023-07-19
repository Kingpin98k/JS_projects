const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

//Creating The Schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"A User Must Have a Name"]
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please Provide a Valid Email !']
    },
    photo:String,   //The uploaded Photo will be stored in outfile-system and the path to that photo will be stored in Photo field
    password:{
        type: String,
        required: [true, 'A strong Password Is a Must'],
        minlength:8,
        select:false
    },
    confirmPassword:{
        type: String,
        required: [true, 'Please Confirm the Password'],
        //This validator will only work on SAVE and CERATE and that is why we will need to update the user Using the save method
        validate:{
            validator:function(el){
                return el===this.password;
            },
            message:"Passwords are Not the Same !"
        }
    }
})

//Using MongooseMiddleware to Encrypt the password Before Saving it...
userSchema.pre('save',async function(next){  //also known as mongooseHook
    //Checking if the password filed is mofified or not before encrypting it (the save can also be cleed when email is changed !!)    
    if(!this.isModified("password")) return next(); //returning after calling the next middleware
    
    //using the async hash function to hash the password
    this.password = await bcrypt.hash(this.password,12);
    //removing confirm_password field from the document
    this.confirmPassword=undefined;
    next();
})


//Creating the Model Out of the Schema
const User = mongoose.model("User",userSchema)

//Exporting the model
module.exports = User