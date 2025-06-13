import connection from "../config/connection.js";

export const checkUserReport=async(userID,bookID)=>{
    try{
        const checkSql = 'SELECT * FROM book_reports WHERE userID = ? AND bookID = ?';
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
        const insertSql = 'INSERT INTO book_reports (userID, bookID, reason) VALUES (?, ?, ?)';
        connection.execute(insertSql, [userID, bookID, reason])
    }catch(error){
      console.log(error);
    }
}

export const getReportCount = async (bookID) => {
  try {
    const countSql = 'SELECT COUNT(*) as count FROM book_reports WHERE bookID = ?';
    const [rows] = await connection.query(countSql, [bookID]);
    // rows[0].count will contain the count
    return rows[0].count;
  } catch (error) {
    console.log(error);
    return 0; 
  }
};
