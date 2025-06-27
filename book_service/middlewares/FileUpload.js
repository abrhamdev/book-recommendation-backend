import multer from 'multer';
import { uploadToDrive } from '../services/driveService.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024, 
  }
});

export const uploadMiddleware = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'bookFile', maxCount: 1 }
]);

export const processFiles = async (req, res, next) => {
  try {
    const cover = req.files.coverImage?.[0];
    const book = req.files.bookFile?.[0];

    const coverUrl = await uploadToDrive(cover, process.env.COVER_FOLDER_ID);
    const bookUrl = await uploadToDrive(book,process.env.BOOK_FOLDER_ID );

    // Remove temp files
    fs.unlinkSync(cover.path);
    fs.unlinkSync(book.path);

    req.body.coverImageUrl = coverUrl;
    req.body.bookFileUrl = bookUrl;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'File upload failed' });
  }
};
