import hashPassword from "../services/hashPassword.js";
import { checkUser, fetchPreference, fetchUser, fetchusers, insertPreference, insertUser } from "../models/userModel.js";
import { generateToken } from "../services/authService.js";
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from "../services/emailService.js";

export const registerUser= async (req,res)=>{
    try{
        const {fullName,email,password} = req.body;

       const users=await checkUser(email);
        if(users.length !== 0){
          return res.status(400).json({message:"User Already found"});
        }
        
        const token = generateToken({ fullName, email, password });
        await sendVerificationEmail(email, token);

        const hashedPassword=await hashPassword(password);

        await insertUser(fullName,email,hashedPassword);
       return res.status(200).json({message:'user Signed up!'});
    }catch(error){
        console.log(error);
    }
}

export const googleSignIn = async (req, res) => {
  try {
    const { name, email, google_id, profile_picture} = req.body;

    if (!name || !email || !google_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const users=await checkUser(email);

        if(users.length !== 0){
          const user = users[0];
          const [preference] = await fetchPreference(users.id);
          let landing;
          if (preference.length != 0) { landing = true;} else { landing = false;}
          const token = generateToken(user.id);
          return res.status(200).json({ message: 'User signed in successfully', token ,landing});
        }

        await insertUser({
          fullName: name,
          email,
          auth_provider: 'google',
          google_id,
          profile_picture,
        });

        const newUser = await checkUser(email);
        const token = generateToken(newUser[0].id);
    
        return res.status(201).json({ message: 'Login successfull', token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login= async(req,res)=>{
  try{
        const {email,password}=req.body;
        const users=await checkUser(email);

        if(users.length == 0){
          return res.status(400).json({message:"User Not found"});
        }

        const user=users[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid password" });
        }
       
        const token = generateToken(user.id);
        return res.status(200).json({ message: "Login successful", token });

  }catch(error){
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getUser= async(req,res)=>{
  try{
        const {userId}=req.body;

       const [users]=await fetchUser(userId);
       const user={
        id:users[0].id,
        name:users[0].name,
        email:users[0].email,
        profile_picture:users[0].profile_picture,
        role: users[0].role
       }
        return res.status(200).json({user});

  }catch(error){
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getProfile= async(req,res)=>{
  try{
        const {userId}=req.body;

       const [users]=await fetchUser(userId);
       const user={
        id:users[0].id,
        name:users[0].name,
        email:users[0].email,
        profile_picture:users[0].profile_picture,
        location:users[0].location,
        birth_date:users[0].birth_date,
        created_at:users[0].created_at,
       }
        return res.status(200).json({user});

  }catch(error){
    console.log(error);
   return res.status(500).json({ message: "Internal server error" });
  }
}

export const getUsers= async(req,res)=>{
  const { userIds } = req.body;
  try {
     const [users]=await fetchusers(userIds);
   return res.json({ users });
  } catch (err) {
   return res.status(500).json({ message: 'Failed to fetch users' });
  }
}

export const setPreference=async(req,res)=>{
  const { userId } = req.body;
  try{
       const preference = await fetchPreference(userId);
       if(preference.length = 0) await insertPreference(req.body);
      return res.status(200).json({message:'Welcome To Nova Reads!'});
  }catch(error){
   return res.status(500).json({ message: 'Failed to save preference' });
  }
}

export const getPreference=async(req,res)=>{
  const { userId } = req.query;
  try{
    const [preference] = await fetchPreference(userId);
    return res.status(200).json(preference[0]);
  }catch(error){
   return res.status(500).json({ message: 'Failed to get preference' });
  }
}