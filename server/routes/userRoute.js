
import express from 'express'
import { loginUser } from '../utils/loginUser.js'
import {  createUser, getAllUsers, getUser,checkLogin } from '../controllers/userController.js'
import authChecker from '../middleware/checkAuthenticity.js'

 const userRouter= express.Router()

userRouter.get('/',getAllUsers)
userRouter.get('/check-login',authChecker,checkLogin)
userRouter.get("/:userId",getUser)
userRouter.post('/login',loginUser);

userRouter.post('/',createUser)



export default userRouter