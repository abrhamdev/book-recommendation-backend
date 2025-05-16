import connection from "../config/connection.js";

export const fetchReviews = async (bookId) => {
  try {
    const [reviews] = await connection.query(
      `
        SELECT r.*, 
          COUNT(CASE WHEN rr.reaction = 'like' THEN 1 END) AS likes,
          COUNT(CASE WHEN rr.reaction = 'dislike' THEN 1 END) AS dislikes
        FROM reviews r
        LEFT JOIN review_reactions rr ON r.reviewID = rr.reviewID
        WHERE r.bookID = ? AND r.status = 'public'
        GROUP BY r.reviewID
        ORDER BY r.timestamp DESC
        `,
      [bookId]
    );
    return [reviews];
  } catch (err) {
    throw new Error(err.message);
  }
};

export const insertReview = async (
  userId,
  bookId,
  rating,
  comment,
  visibility
) => {
  try {
    await connection.execute(
      `INSERT INTO reviews (userID, bookID, rating, comment, status) VALUES (?,?, ?,?, ?)`,
      [userId, bookId, rating, comment, visibility]
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

export const checkReview = async (userId, bookId) => {
  try {
    const [existingReview] = await connection.execute(
      "SELECT * FROM reviews WHERE userID = ? AND bookID = ?",
      [userId, bookId]
    );
    return [existingReview];
  } catch (error) {
    throw new Error(error.message);
  }
};

export const checkReviewReaction= async (userId, reviewID,reaction) => {
  try {
    const [existingReaction] = await connection.execute(
      "SELECT * FROM review_reactions WHERE userID = ? AND reviewID = ?",
      [userId, reviewID]
    );
    if(existingReaction.length > 0)
    if(existingReaction[0].reaction == reaction){
      return;
    }else{
    return "update";
    }else{
      return "insert";
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateReaction = async (reaction,userId, reviewID) => {
  try {
    await connection.execute(
      'UPDATE review_reactions SET reaction = ? WHERE userID = ? AND reviewID = ?',
        [reaction, userId, reviewID]
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const insertReaction = async (reaction, userId,reviewID) => {
  try {
    const [existingReview] = await connection.execute(
      'INSERT INTO review_reactions (userID, reviewID, reaction) VALUES (?, ?, ?)',
        [userId, reviewID, reaction]
    );
    return [existingReview];
  } catch (error) {
    throw new Error(error.message);
  }
};

export const checkUserReport=async(userID,reviewID)=>{
  try{
      const checkSql = 'SELECT * FROM review_reports WHERE userID = ? AND reviewID = ?';
    const [results]= await connection.query(checkSql, [userID, reviewID]);
    if (results.length > 0) {
      return true;
    }else{
      return false;
    }
  }catch(error){
      console.log(error);
  }
}

export const insertReviewReport=async(userID,reviewID,reason)=>{
  try{
      const insertSql = 'INSERT INTO review_reports (userID, reviewID, reason) VALUES (?, ?, ?)';
      connection.execute(insertSql, [userID, reviewID, reason])
  }catch(error){
    console.log(error);
  }
}

export const insertReply=async(userID,reviewID,replyText)=>{
  try{
      const insertSql = 'INSERT INTO replies (userID, reviewID, reply_text) VALUES (?, ?, ?)';
      connection.execute(insertSql, [userID, reviewID, replyText])
  }catch(error){
    console.log(error);
  }
}