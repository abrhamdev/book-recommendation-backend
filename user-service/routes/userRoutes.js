import express from "express";
import { registerUser,googleSignIn,login, getUser, getProfile, getUsers, setPreference, getPreference, changePassword } from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.post('/signup', registerUser);
userRouter.post('/google-signin',googleSignIn);
userRouter.post('/login',login);
userRouter.post('/me',getUser);
userRouter.post('/me/profile',getProfile);
userRouter.post('/change-password', changePassword);
userRouter.post('/bulk',getUsers);
userRouter.post('/me/preference',setPreference);
userRouter.get('/me/getPreference',getPreference);

export default userRouter;