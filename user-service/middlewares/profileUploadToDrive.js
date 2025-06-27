import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const KEYFILEPATH = process.env.KEYFILEPATH; 
const SCOPES = process.env.SCOPES;
const FOLDER_ID =process.env.PROFILE_IMAGE_FOLDER_ID; 

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

export const uploadToDrive = async (file) => {
    try {
      const fileMetadata = {
        name: file.originalname,
        parents: [FOLDER_ID],
      };
  
      // Create a proper readable stream
      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      };
  
      const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });
  
      // Make the file public
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
      // Get the public URL
      const publicUrl = `https://drive.google.com/uc?id=${response.data.id}`;
      //const publicUrl = `https://lh3.googleusercontent.com/d/${response.data.id}=w1000`;
      
      // Delete the local file
      fs.unlinkSync(file.path);
  
      return publicUrl;
    } catch (error) {
      // Clean up the local file if there's an error
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
};
