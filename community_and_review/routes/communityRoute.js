import express from "express";
import { clubJoin, createBookClub, getBookClubMembers, getClubs, getJoined, getMessages } from "../controllers/bookClubController.js";

const communityRouter=express.Router();


communityRouter.post('/bookclub/create', createBookClub);
communityRouter.get('/bookclub/fetchclubs', getClubs);
communityRouter.post('/bookclub/joined',getJoined);
communityRouter.post('/bookclub/members',getBookClubMembers);
communityRouter.post('/bookclub/join',clubJoin);
communityRouter.post('/bookclub/messages',getMessages);


export default communityRouter;