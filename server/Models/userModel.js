
import mongoose from "mongoose";
import {v4 as uuid} from "uuid"
import bcrypt from "bcryptjs"
export const userSchema= new  mongoose.Schema({

    _id:{
type:String,
default:uuid()
    },
    userName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true, 
        trim:true,
        index:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String
    },
    meetings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Meeting"
        }
    ]

},{
    timestamps:true
})

userSchema.pre('save',async function(next){
if(!this.isModified) return next();
try{
    this.password= await bcrypt.hash(this.password,12)
     next();
}
catch (error){
    next(error)
}
})

// create a function for this schema using which i can compare the password anytime 

userSchema.methods.comparePassword= async function(password){
     return await bcrypt.compare(password,this.password);
    }

    export const userModel= mongoose.model('users',userSchema);