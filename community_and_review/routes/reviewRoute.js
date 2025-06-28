import express from "express";
import { getReviews,setReview,setReaction, reportReview, reply, allReview } from "../controllers/reviewController.js";
import { reportBook } from "../controllers/bookController.js";

const reviewRouter=express.Router();


reviewRouter.get('/reviews/:id', getReviews);
reviewRouter.post('/setReview', setReview);
reviewRouter.post('/reviews/react', setReaction);
reviewRouter.post('/report/book',reportBook);
reviewRouter.post('/report/review',reportReview);
reviewRouter.post('/review/reply',reply);
reviewRouter.get('/getallreviews',allReview);

export default reviewRouter;