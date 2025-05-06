import express from "express";
import { registerUser,googleSignIn,login, getUser, getProfile, getUsers } from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.post('/signup', registerUser);
userRouter.post('/google-signin',googleSignIn);
userRouter.post('/login',login);
userRouter.post('/me',getUser);
userRouter.post('/me/profile',getProfile);
userRouter.post('/bulk',getUsers);

export default userRouter;