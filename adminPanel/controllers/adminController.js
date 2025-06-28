import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getAdminStats=async(req,res)=>{
  try{
    const allusers = await axios.get(`${process.env.USERS_SERVICE}/users/getallusers`);
    const allreviews = await axios.get(`${process.env.COMMUNITY_AND_REVIEW_SERVICE}/books/getallreviews`);
    const allbooks = await axios.get(`${process.env.BOOKS_SERVICE}/books/getallbooks`);
    res.status(200).json({totalUsers:allusers.data.length,totalReviews:allreviews.data.length,totalBooks:allbooks.data.length});
    
  }catch(error){
    console.log(error)
  }
}

export const getUsers=async(req,res)=>{
  try{
    const allusers = await axios.get(`${process.env.USERS_SERVICE}/users/getallusers`);
    res.status(200).json({users:allusers.data});
  }catch(error){
    console.log(error)
  }
}