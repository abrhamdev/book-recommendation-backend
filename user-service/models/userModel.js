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