

import { userModel } from "../Models/userModel.js";
import { createAccessToken } from "../utils/createJwt.js";


export const checkLogin= async(req ,res)=>{
  console.log("Checking login for user:", req.user);
const user= req.user;
if(user) return res.status(200).json({
  user
})
return res.status(403).json({
  "message":"unauthorized "
})
}

export const getUser=async (req,res)=>{
    const userId= req.params.userId;
    const user=await userModel.findById(userId);
    if(user) return res.json({
        user 
    }).status(200);

    return res.status(404).json({
        "message":"no such user exists"
    });
}
export const createUser = async (req, res) => {
    try{
        // check wheter the user with this detil alreay exists or any of the field is not empty
        const {password,userName,email}= req.body;
        if(password.length<8) return res.status(400).send("valid password required")
        
            if(userName.trim()===""|| email.trim()==="" ) return res.status(400).send("fill data positively")
const user = await userModel.findOne({userName});
            if(user) return res.status(400).json({
                "message":"username already exists"
            })

            const emailUser = await userModel.findOne({
                email
            })
            if(emailUser) return res.status(400).json({
                "message":" user with this email already exists"
            })
    }
    catch(error){
return res.status(500)
    }
  try {
    const user = new userModel(req.body);
    await user.save();
    res.cookie("access_token",createAccessToken({
      userName:user.userName,
      email:user.email
     }),{
      maxAge:15*60*1000,
      httpOnly:true,
      secure:true,
      sameSite:"strict"
    })
     res.cookie("refresh_token",createRefreshToken({
      userName:user.userName,
      email:user.email
     }),{
      maxAge:1*60*1000,
      httpOnly:true,
      secure:true,
      sameSite:"strict"
    })
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
};

// ✅ Update User
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};