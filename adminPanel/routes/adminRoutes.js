import express from "express";
import { getAdminStats, getUsers } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const adminRouter=express.Router();


adminRouter.get('/stats',authMiddleware,getAdminStats);
adminRouter.get('/fetchusers',authMiddleware,getUsers);

export default adminRouter;