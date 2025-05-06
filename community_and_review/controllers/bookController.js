import { checkUserReport, insertBookReport } from "../models/bookModels.js";

export const reportBook=async(req,res)=>{

    const { userId, id, reportReason } = req.body;
    try {
       const userReportBefor=await checkUserReport(userId,id)
     
         if(userReportBefor){
            return res.status(400).json({message:"You Reported This Book!"});
         }
         insertBookReport(userId,id,reportReason);    
         return res.status(200).json({message:"Book Reported Successfully!"});
      }catch(error){
        console.log(error);
      }
}