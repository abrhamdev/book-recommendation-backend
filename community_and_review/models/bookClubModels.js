import connection from "../config/connection.js";

export const createClub=async(name,description,visibility,coverImage='null',genreFocus,userId,current_book_id='null')=>{
    try{
        const insertSql = `
  INSERT INTO book_clubs (
    name,
    description,
    creator_id,
    cover_image_url,
    visibility,
    genre_focus,
    current_book_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`;

    const [result]=await connection.execute(insertSql, [name, description, userId,coverImage,visibility,genreFocus,current_book_id]);
    const clubId=result.insertId;

    const memberSql = `
      INSERT INTO book_club_members (user_id, book_club_id, role)
      VALUES (?, ?, 'moderator')
    `;
    await connection.execute(memberSql, [userId, clubId]);

    }catch(error){
      console.log(error);
    }
}

export const fetchClubs=async()=>{
    try{
        const sql=`SELECT bc.*, 
             (
               SELECT COUNT(*) 
               FROM book_club_members bcm2 
               WHERE bcm2.book_club_id = bc.id
             ) AS member_count
      FROM book_clubs bc
      `;
        const [results]= await connection.execute(sql);
        return [results];
    }catch(error){
    console.log(error);
    }
}

export const getUserBookClubs = async (userId) => {
    try {
      const query = `
        SELECT bc.*
        FROM book_club_members bcm
        JOIN book_clubs bc ON bcm.book_club_id = bc.id
        WHERE bcm.user_id = ?
      `;
      const [clubs] = await connection.execute(query, [userId]);
      return [clubs];
    } catch (error) {
      console.error('Error fetching user book clubs:', error);
    }
  };


export const fetchMembers = async (clubId) => {
    try {
        const [members] = await connection.execute(
            'SELECT user_id, role FROM book_club_members WHERE book_club_id = ?',
            [clubId]
          );
          
      return [members];
    } catch (error) {
      console.error('Error fetching members', error);
    }
  };
  
export const checkUserJoined=async(userId,clubId)=>{
    try{
          const [users]=await connection.execute(
            `SELECT * FROM book_club_members WHERE user_id=? AND book_club_id=?`,
          [userId,clubId]
        )
        return [users];
    }catch(error){
    console.log(error);
    }
}

export const joinUser=async(userId,clubId)=>{
    try{
          const [users]=await connection.execute(
            ` INSERT INTO book_club_members (user_id, book_club_id)
      VALUES (?, ?)`,
          [userId,clubId]
        )
        return [users];
    }catch(error){
    console.log(error);
    }
}