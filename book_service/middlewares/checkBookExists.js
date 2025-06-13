import {checkBook} from '../models/BookModel.js';

export const checkBookExists = async (req, res, next) => {
  try {
    const { title } = req.body; 
    const existingBook = await checkBook(title);

    if (existingBook) {
      return res.status(409).json({ error: "Book already exists" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database check failed" });
  }
};