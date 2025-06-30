import { google } from 'googleapis';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const auth = new google.auth.GoogleAuth({
  keyFile: "./google_service_account/brs-drive-api-access-8bd9e9139b6c.json",
  scopes: ['https://www.googleapis.com/auth/drive']
});


export async function uploadToDrive(file, folderId) {
  const fileMetadata = {
    name: file.originalname,
    parents: [folderId]
  };
  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path)
  };

  const authClient = await auth.getClient(); // get authenticated client
  const driveClient = google.drive({ version: 'v3', auth: authClient });

  const response = await driveClient.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id'
  });

  // Make file public
  await driveClient.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone'
    }
  });

  const fileUrl = `https://drive.google.com/uc?id=${response.data.id}`;
  return fileUrl;
}

export const convertToDirectUrl = (driveUrl) => {
  // Extract file ID from various Google Drive URL formats
  const patterns = [
    /\/file\/d\/([^\/]+)/,         // Standard shareable link
    /id=([^&]+)/,                   // UC parameter format
    /\/thumbnail\?id=([^&]+)/,      // Thumbnail format
    /\/open\?id=([^&]+)/,           // Open format
    /\/uc\?id=([^&]+)/              // Direct UC format
  ];
  
  for (const pattern of patterns) {
    const match = driveUrl.match(pattern);
    if (match && match[1]) {
      // Use this format for reliable image access
      return `https://lh3.googleusercontent.com/d/${match[1]}=s400`;
    }
  }
  
  // Fallback to original URL
  return driveUrl;
};

export const convertToDownloadUrl = (driveUrl) => {
  // Same extraction logic as above
  const patterns = [
    /\/file\/d\/([^\/]+)/,
    /id=([^&]+)/,
    /\/thumbnail\?id=([^&]+)/,
    /\/open\?id=([^&]+)/,
    /\/uc\?id=([^&]+)/
  ];
  
  for (const pattern of patterns) {
    const match = driveUrl.match(pattern);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  
  return driveUrl;
};