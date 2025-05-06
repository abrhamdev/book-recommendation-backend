import { checkUserJoined, createClub, fetchClubs, fetchMembers, getUserBookClubs, joinUser } from "../models/bookClubModels.js";
import axios from 'axios';
import chatMessage from "../models/chatMessage.js";

export const createBookClub=async(req,res)=>{
  const {name,description,coverImage,visibility,genreFocus,userId}=req.body;
    try {
         await createClub(name,description,visibility,coverImage,genreFocus,userId);
        return res.status(200).json({message:'Book Club Created'});
      }catch(error){
       return res.status(400).json({message:'Faild Create Book Club!'});
        console.log(error);
      }
}

export const getClubs=async(req,res)=>{
    try{
        const [clubs]=await fetchClubs();
        return res.status(200).json({clubs});
    }catch(error){
      console.log(error);
    }
}

export const getJoined=async(req,res)=>{
    const {userId}=req.body;
    try{
        const [clubs]=await getUserBookClubs(userId);
      return res.status(200).json({clubs}); 
    }catch(error){
         console.log(error);
    }
}

export const getBookClubMembers= async(req,res)=>{
    const { clubId } = req.body;
    try{
        const [members]=await fetchMembers(clubId);
        const userIds = members.map(m => m.user_id);
     const response = await axios.post(`${process.env.USERS_SERVICE}/users/bulk`, {
       userIds
      });

     const userData = response.data.users; 
     const combined = members.map(member => {
        const user = userData.find(u => u.id === member.user_id);
        return {
          ...user,
          role: member.role
        };});

        res.status(200).json({ members: combined });

    }catch(error){
        console.log(error);
    }
}

export const clubJoin=async(req,res)=>{
    const {userId,clubId}=req.body;
    try{
        const [checkJoin]=await checkUserJoined(userId,clubId);

        if(checkJoin.length >0){
            return res.status(400).json({message:'You Already Joind'});
        }
        await joinUser(userId,clubId);

        return res.status(200).json({message:'Joining Successful'});
      
    }catch(error){
     console.log(error);
    }
}

export const getMessages=async(req,res)=>{
  const {clubId}=req.body;
  try
  {
    const rows=await chatMessage.find({clubId}).sort({timestamp:1});

    const messages = await Promise.all(rows.map(async (message) => {
      const userId = message.senderId;
      try {
        const response = await axios.post(`${process.env.USERS_SERVICE}/users/me`, { userId });
    
        const messageObj = message.toObject(); 
        messageObj.user = response.data.user;
    
        return messageObj;
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
    
        const messageObj = message.toObject();
        messageObj.user = null;
    
        return messageObj;
      }
  }));
    return res.status(200).json({messages});
  }catch(error){
    console.log(error);
  }
}