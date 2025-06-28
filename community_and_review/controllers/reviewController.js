import { response } from "express";
import { checkReview, checkReviewReaction, checkUserReport, fetchAllReviews, fetchReviews, insertReaction, insertReply, insertReview, insertReviewReport, updateReaction } from "../models/reviewModels.js";
import axios from 'axios';

export const setReview=async (req, res) => {
    const {userId,bookId,rating,comment,visibility } = req.body;  
    try {

        const [existingReview] =await checkReview(userId,bookId);

        if (existingReview.length > 0) {
            return res.status(400).json({ message: 'You have already reviewed this book.' });
          }

      await insertReview(userId,bookId,rating,comment,visibility);
      res.status(200).json({message:"Review Submitted Successfully!"});
    } catch (error) {
      console.error('Error inserting reviews:', error);
      res.status(500).json({ error: 'Submitting Review Failed' });
    }
}

export const getReviews=async (req, res) => {
    
    const { id } = req.params;
    try {
      const [rows] = await fetchReviews(id);
      
      const reviews = await Promise.all(rows.map(async (review) => {
        const userId = review.userID;
        try {
            const response = await axios.post(`${process.env.USERS_SERVICE}/users/me`, { userId });
            
            return {
                ...review,
                user: response.data.user
            };
        } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            return {
                ...review,
                user: null
            };
        }
    }));
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
}

export const setReaction=async (req, res) => {
    const {userId,reviewId,reaction} = req.body;  
    try {

        const action =await checkReviewReaction(userId,reviewId,reaction);
        if (action  == 'update') {
           await updateReaction(reaction, userId, reviewId);
          }else if(action  == 'insert'){
            await insertReaction(reaction, userId, reviewId)
          }

      res.status(200).json({message:"Reacted Successfully!"});
    } catch (error) {
      console.error( error);
      res.status(500).json({ error: 'Submitting Review Failed' });
    }
}

export const reportReview=async(req,res)=>{

    const { userId, id, reportReason } = req.body;
    try {
       const userReportBefor=await checkUserReport(userId,id);
     
         if(userReportBefor){
            return res.status(400).json({message:"You Reported This Review!"});
         }
         insertReviewReport(userId,id,reportReason);    
         return res.status(200).json({message:"Review Reported Successfully!"});
      }catch(error){
        console.log(error);
      }
}

export const reply=async(req,res)=>{

  const { userId, reviewID, replyText } = req.body;
  try {
       insertReply(userId,reviewID,replyText);
       res.status(200).json({message:"replied!"});
    }catch(error){
      console.log(error);
      res.status(400).json({message:"Failed to Reply"});
    }
}

export const allReview=async(req,res)=>{

  try {
      const [reviews] =await fetchAllReviews();
       res.status(200).json(reviews);
    }catch(error){
      console.log(error);
      res.status(400).json({message:"Failed to fetch reviews"});
    }
}