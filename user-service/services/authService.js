import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

export const generateToken = (userId) => {

  return jwt.sign({ user_id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' }); 

};


export const generateEmailToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "5m" });
  };
  
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  };
