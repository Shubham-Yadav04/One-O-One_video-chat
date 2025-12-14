/**
    * @description      : 
    * @author           : lenovo
    * @group            : 
    * @created          : 16/09/2025 - 00:09:13
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 16/09/2025
    * - Author          : lenovo
    * - Modification    : 
**/
import { mongoose } from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
export const connectDb=async()=>{
    console.log(process.env.MONGODB_URL)
    try{
const connection =await  mongoose.connect(`${process.env.MONGODB_URL}`);
console.log("Connected to MongoDB");
    }
    catch(error){
        console.log(error.message , "in DB Connection ")
    }
}