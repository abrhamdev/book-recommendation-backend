import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
export const getTrending=async(req,res)=>{
    try{
  // Get parameters from frontend or use defaults
  const maxResults =5;
    
  // Fetch from Google Books API
  const response = await axios.get(GOOGLE_BOOKS_API, {
    params: {
      q: 'subject:fiction',
      orderBy: 'newest',
      maxResults,
      key: API_KEY
    }
  });

  // Format the response for frontend
  const books = response.data.items.map(item => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors,
    description: item.volumeInfo.description,
    cover: item.volumeInfo.imageLinks?.thumbnail || null,
    averageRating: item.volumeInfo.averageRating,
    ratingsCount: item.volumeInfo.ratingsCount
  }));
  res.json(books);
} catch (error) {
  res.status(500).json({ error: 'Failed to fetch books' });
}
}

export const getBook=async(req,res)=>{
    const { id } = req.params;  
  try {
    const response = await axios.get(`${process.env.GOOGLE_BOOKS_API_VOLUMES_URL}/${id}?key=${process.env.GOOGLE_BOOKS_API_KEY}`);
    const bookData = response.data;
    const bookDetails = {
      title: bookData.volumeInfo.title || 'N/A',
      author: bookData.volumeInfo.authors?.join(', ') || 'N/A',
      genres: bookData.volumeInfo.categories || 'N/A',
      publisher: bookData.volumeInfo.publisher || 'N/A',
      publicationDate: bookData.volumeInfo.publishedDate || 'N/A',
      pageCount: bookData.volumeInfo.pageCount || 'N/A',
      language: bookData.volumeInfo.language || 'N/A',
      rating: bookData.volumeInfo.averageRating || 'N/A',
      description: bookData.volumeInfo.description || 'N/A',
      coverImage: bookData.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196.png?text=No+Cover',
    };
    res.status(200).json(bookDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
}

export const getRelatedBooks = async (req, res) => {
  const { q } = req.query;
  try {
      const response = await axios.get(
          `${process.env.GOOGLE_BOOKS_API_VOLUMES_URL}?q=${encodeURIComponent(q)}&maxResults=5&key=${process.env.GOOGLE_BOOKS_API_KEY}`
      );

      const items = response.data.items || [];
  
      const books = items.map(item => ({
        id: item.id,
        title: item.volumeInfo?.title || 'N/A',
        author: item.volumeInfo?.authors?.join(', ') || 'N/A',
        genres: item.volumeInfo?.categories || 'N/A',
        publisher: item.volumeInfo?.publisher || 'N/A',
        publicationDate: item.volumeInfo?.publishedDate || 'N/A',
        pageCount: item.volumeInfo?.pageCount || 'N/A',
        language: item.volumeInfo?.language || 'N/A',
        rating: item.volumeInfo?.averageRating || 'N/A',
        description: item.volumeInfo?.description || 'N/A',
        coverImage: item.volumeInfo?.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196.png?text=No+Cover',
      }));
  
      res.status(200).json(books);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch related books' });
  }
}

export const search = async (req, res) => {
  const { q, startIndex = 0, maxResults = 10 } = req.query;
  
  try {
    const response = await axios.get(
      `${process.env.GOOGLE_BOOKS_API_VOLUMES_URL}?q=intitle:${q}&startIndex=${startIndex}&maxResults=${maxResults}`
    );
    res.status(200).json({
      items: response.data.items || [],
      totalItems: response.data.totalItems || 0
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
};