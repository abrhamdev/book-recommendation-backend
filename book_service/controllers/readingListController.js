import { 
    addToReadingList, 
    getReadingListByUserId,
    updateReadingStatus,
    removeFromReadingList,
    updateReadingProgress,
    isBookInReadingList
  } from "../models/ReadingListModel.js";
  import {getEthBook} from '../models/BookModel.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();  

  // Add these new controller methods
  export const addToReadingListController = async (req, res) => {
    try {
      const { bookId, status } = req.body;
      const userId = req.userId; // From authMiddleware
      
      const result = await addToReadingList(userId, bookId, status || 'wantToRead');
      res.status(201).json({ message: 'Book added to reading list', data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to add to reading list' });
    }
  };
  
  export const getReadingListController = async (req, res) => {
    
    try {
      const userId = req.userId;
      const readingList = await getReadingListByUserId(userId);
  
      // Fetch book details from Google Books API
      const enrichedList = await Promise.all(readingList.map(async (item) => {
        try {
          const response = await getEthBook(item.bookId.replace('local-', ''));
          // Use ethbooks data if available
          if (response.length > 0) {
            return {
              ...item,
              title: response[0].title,
              author: response[0].author,
              coverImage: response[0].coverImageUrl || 'https://via.placeholder.com/128x196.png?text=No+Cover',
              pageCount: response[0].pageCount || 0,
              description: response[0].description || ''
            };
          }
          else{
            // Fetch from Google Books API
            const response = await axios.get(
              `https://www.googleapis.com/books/v1/volumes/${item.bookId}?key=${process.env.GOOGLE_BOOKS_API_KEY}`
            );
            
            const bookData = response.data.volumeInfo;
            return {
                ...item,
                title: bookData.title || 'N/A',
                author: bookData.authors?.join(', ') || 'N/A',
                coverImage: bookData.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196.png?text=No+Cover',
                pageCount: bookData.pageCount || 0,
                description: bookData.description || ''
            };
          }
        } catch (error) {
          console.error(`Failed to fetch details for book ${item.bookId}:`, error);
          return {
              ...item,
              title: 'N/A',
              author: 'N/A',
              coverImage: 'https://via.placeholder.com/128x196.png?text=No+Cover',
              pageCount: 0,
              description: ''
          };
        }
      }));
  
      // Organize by status for frontend
      const organizedList = {
        currentlyReading: enrichedList.filter(item => item.status === 'currentlyReading'),
        wantToRead: enrichedList.filter(item => item.status === 'wantToRead'),
        completed: enrichedList.filter(item => item.status === 'completed')
      };
      
      res.status(200).json(organizedList);
    } catch (error) {
      console.error('Error fetching reading list:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch reading list' });
    }
  };
  
  export const updateReadingStatusController = async (req, res) => {
    try {
      const { bookId } = req.params;
      const { status } = req.body;
      const userId = req.userId;
      
      await updateReadingStatus(userId, bookId, status);
      res.status(200).json({ message: 'Reading status updated' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to update reading status' });
    }
  };
  
  export const removeFromReadingListController = async (req, res) => {
    try {
      const { bookId } = req.params;
      const userId = req.userId;
      
      await removeFromReadingList(userId, bookId);
      res.status(200).json({ message: 'Book removed from reading list' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to remove from reading list' });
    }
  };
  
  export const checkBookInReadingListController = async (req, res) => {
    try {
      const { bookId } = req.params;
      const userId = req.userId;
      
      const exists = await isBookInReadingList(userId, bookId);
      res.status(200).json({ exists });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to check reading list' });
    }
  };