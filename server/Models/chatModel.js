
import mongoose from "mongoose";
import {v4 as uuid} from "uuid"
const chatSchema= new mongoose.Schema({
    
    _id:{
type:String,
default:uuid()
    },
    meeting:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Meeting"
    },
    sender:{
 type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
               ref:"User"
           },
    message:{
        type:String
    }
},{
    timestamps:true
})

export const chatModel= mongoose.model("Chat",chatSchema);