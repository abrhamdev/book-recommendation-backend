import { checkUserReport, getReportCount, insertBookReport } from "../models/bookModels.js";
import { produceMessage } from "../kafka/producer.js"; 
import { BOOK_REPORT_ALERTS } from "../kafka/topics.js";

export const reportBook=async(req,res)=>{

    const { userId, id, reportReason } = req.body;
    try {
       const userReportBefor=await checkUserReport(userId,id)
     
         if(userReportBefor){
            return res.status(400).json({message:"You Reported This Book!"});
         }
        await insertBookReport(userId,id,reportReason);    
         
        // Check total report count after insertion
           const reportCount = await getReportCount(id);
       
           // Send Kafka message when reportCount reaches threshold (or for testing, when it's 1)
              if (reportCount === 1) {
                await produceMessage(BOOK_REPORT_ALERTS, [
                  { value: JSON.stringify({ id, reportCount,reportReason }) },
                ]);
                console.log(`Kafka message produced for bookId ${id} with reportCount ${reportCount}`);
              }
           
         return res.status(200).json({message:"Book Reported Successfully!"});
      }catch(error){
        console.log(error);
      }
}