import express from "express";
import { registerUser,googleSignIn,login, getUser, getProfile, getUsers, setPreference, getPreference,changePassword, fetchPreferences, updatePreference, updateProfile, upload_profile, allusers } from "../controllers/userController.js";
import { upload } from '../middlewares/multer.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRouter=express.Router();

userRouter.post('/signup', registerUser);
userRouter.post('/google-signin',googleSignIn);
userRouter.post('/login',login);
userRouter.post('/me',getUser);
userRouter.post('/me/profile',getProfile);
userRouter.post('/change-password', changePassword);
userRouter.post('/me/updateProfile',updateProfile);
userRouter.post('/bulk',getUsers);
userRouter.post('/me/preference',setPreference);
userRouter.post('/me/updatePreference',updatePreference);
userRouter.get('/me/getPreference',getPreference);
userRouter.post('/me/fetchPreferences',fetchPreferences);
userRouter.post('/me/upload-profile-picture',authMiddleware,upload.single("profile_picture"),upload_profile);
userRouter.get('/getallusers',allusers);
export default userRouter;