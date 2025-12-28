
import express from 'express'
import { loginUser } from '../utils/loginUser.js'
import {  createUser, getAllUsers, getUser,checkLogin } from '../controllers/userController.js'
import { googleAuthCallback, getAuthStatus, logout } from '../controllers/googleAuthController.js'
import authChecker from '../middleware/checkAuthenticity.js'
import passport from '../config/passportConfig.js';
 const userRouter= express.Router()

userRouter.get('/',getAllUsers)
   
// Google OAuth Routes
userRouter.get('/auth/google', passport.authenticate('google', {
    session: false,  
  scope: ['profile', 'email']
}));

userRouter.get('/auth/google/callback', 
  passport.authenticate('google', { session: false,  failureRedirect: '/login' }),
  googleAuthCallback
);

// Auth status and logout
userRouter.get('/auth/status', getAuthStatus);
userRouter.post('/auth/logout', logout);

userRouter.get('/check-login',authChecker,checkLogin)
userRouter.get("/:userId",getUser)
userRouter.post('/login',loginUser);

userRouter.post('/',authChecker,createUser) 
 
export default userRouter