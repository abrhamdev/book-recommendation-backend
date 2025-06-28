import connection from "../config/connection.js";

export const checkUser=async(email)=>{
    try{
         const query="SELECT * FROM users WHERE email=?";
         const [users]=await connection.execute(query,[email]);
         return users;
    }catch(err){
        throw new Error(err);
    }
}


export const insertUser = async ({ fullName, email, password = null, auth_provider = 'local', google_id = null, birth_date = null, location = null, profile_picture = null }) => {
  try {
    await connection.execute(
      `INSERT INTO users 
        (name, email, password, auth_provider, google_id, birth_date, location, profile_picture)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullName, email, password, auth_provider, google_id, birth_date, location, profile_picture]
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

export const fetchUser=async(userId)=>{
  try{
       const query="SELECT * FROM users WHERE id=?";
       const [users]=await connection.execute(query,[userId]);
       return [users];
  }catch(err){
      throw new Error(err);
  }
}

export const updateProf=async(data)=>{
  try{
       const query = `UPDATE users SET name=?,email=?,birth_date=?,location=? WHERE id = ?`;
       const [users]=await connection.execute(query,[data.name,data.email,data.birth_date,data.location,data.userId]);
  }catch(err){
      throw new Error(err);
  }
}

export const fetchusers=async(userIds)=>{
  try{
    const [users] = await connection.query(
      'SELECT id, name, email,profile_picture FROM users WHERE id IN (?)',
      [userIds]
    );
    return [users];
  }catch(error){
    console.log(error);
  }
}

export const updatePreferences=async(preferences)=>{
  try {
    const {
      languages,
      genres,
      ageGroup,
      bookLength,
      authors,
      userId,
    } = preferences;
    
    await connection.execute(
      `UPDATE preferences
      SET
          age_group = ?,
          book_length = ?,
          languages = ?,
          genres = ?,
          authors = ?
      WHERE user_id = ?`,
      [
        ageGroup,
        bookLength,
        languages,
        genres,
        authors,
        userId,
      ]
    );
    
  } catch (err) {
    throw new Error(err.message);
  }
}

export const insertPreference=async(preferences)=>{
  try {
    const {
      languages,
      genres,
      ageGroup,
      bookLength,
      authors,
      userId,
    } = preferences;
    
    await connection.execute(
      `INSERT INTO preferences 
        (user_id, languages, genres, age_group, book_length, authors)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        JSON.stringify(languages),
        JSON.stringify(genres),
        ageGroup,
        bookLength,
        JSON.stringify(authors)
      ]
    );
    
  } catch (err) {
    throw new Error(err.message);
  }
}

export const fetchPreference=async(userId)=>{
  try{
    const [preferences] = await connection.query(
      'SELECT * FROM preferences WHERE user_id=?',
      [userId]
    );
    return [preferences];
  }catch(error){
    console.log(error);
  }
}
export const updateProfiletoDb=async(userId,imageUrl)=>{
  try{
    
    await connection.query(
      ` UPDATE users
            SET profile_picture = ?
            WHERE id = ?;
          `,
      [imageUrl,userId]
    );
  }catch(error){
    console.log(error);
  }
}

export const fetchAllUser=async()=>{
  try{
    
    const [users]=await connection.query(
      ` SELECT * FROM users`
    );
     return [users]
  }catch(error){
    console.log(error);
  }
}