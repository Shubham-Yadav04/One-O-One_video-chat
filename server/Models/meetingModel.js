
import mongoose from "mongoose";
import {v4 as uuid} from "uuid"
export const meetingSchema= new mongoose.Schema({
    
    _id:{
type:String,
default:uuid()
    },
    title:{
        type:String,
    },
    time:{
        type:Date,
    },
    admin:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
    },
    password:{
type:String,
    },
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    status:{
type:String,
enum:["ENDED","SCHEDULED" ,"ONGOING"],
required:true
    },
    chats:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Chat"
        }
    ],
},{
    timestamps:true
})

export const meetingModel= mongoose.model("Meeting",meetingModel);