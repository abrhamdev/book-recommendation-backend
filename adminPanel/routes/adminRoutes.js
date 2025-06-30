import express from "express";
import { fetchBooks, fetchReviews, getAdminStats, getUsers } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const adminRouter=express.Router();


adminRouter.get('/stats',authMiddleware,getAdminStats);
adminRouter.get('/fetchusers',authMiddleware,getUsers);
adminRouter.get('/books',authMiddleware,fetchBooks);
adminRouter.get('/books/reviews',authMiddleware,fetchReviews);

export default adminRouter;