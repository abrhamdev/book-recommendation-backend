import connection from "../config/connection.js";

export const checkUserReport=async(userID,bookID)=>{
    try{
        const checkSql = 'SELECT * FROM Book_Reports WHERE userID = ? AND bookID = ?';
      const [results]= await connection.query(checkSql, [userID, bookID]);
      if (results.length > 0) {
        return true;
      }else{
        return false;
      }
    }catch(error){
        console.log(error);
    }
}

export const insertBookReport=async(userID,bookID,reason)=>{
    try{
        const insertSql = 'INSERT INTO Book_Reports (userID, bookID, reason) VALUES (?, ?, ?)';
        connection.execute(insertSql, [userID, bookID, reason])
    }catch(error){
      console.log(error);
    }
}