import axios from 'axios';
import dotenv from 'dotenv';
import { addbook } from "../models/BookModel.js";

dotenv.config();

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

export const getTrending = async (req, res) => {
  try {
    const maxResults = 5;
    const response = await axios.get(GOOGLE_BOOKS_API, {
      params: {
        q: 'subject:fiction',
        orderBy: 'newest',
        maxResults,
        key: API_KEY
      }
    });

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
};

export const getBook = async (req, res) => {
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
};

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
};

export const search = async (req, res) => {
  const { q, startIndex = 0, maxResults = 10, genre, language, ageGroup, bookLength, minYear, maxYear, minRating } = req.query;
  try {
    const maxTotalResults = 200; // Google Books API's practical limit - it's the api's unofficial ceiling so please don't increase this recklessly
    let allItems = [];

    // Fetch in batches 200
    while (allItems.length < maxTotalResults) {
      const response = await axios.get(
        `${process.env.GOOGLE_BOOKS_API_VOLUMES_URL}?q=intitle:${encodeURIComponent(q)}&startIndex=${allItems.length}&maxResults=40&key=${API_KEY}`
      );
      const newItems = response.data.items || [];
      if (newItems.length === 0) break;
      allItems = allItems.concat(newItems);
    }

    let filteredItems = allItems;
    if (genre) filteredItems = filteredItems.filter(item => item.volumeInfo.categories?.includes(genre));
    if (language) filteredItems = filteredItems.filter(item => item.volumeInfo.language === language);
    if (ageGroup) {
      const ageMappings = { 'Children': 'Juvenile', 'Young Adult': 'Young Adult', 'Adult': 'Adult' };
      filteredItems = filteredItems.filter(item => item.volumeInfo.categories?.includes(ageMappings[ageGroup] || ageGroup));
    }
    if (bookLength) {
      const lengthMappings = { 'Short (< 200 pages)': 200, 'Medium (200-400 pages)': 400, 'Long (> 400 pages)': 10000 };
      const maxPages = lengthMappings[bookLength];
      filteredItems = filteredItems.filter(item => item.volumeInfo.pageCount <= maxPages);
    }
    if (minYear || maxYear) {
      filteredItems = filteredItems.filter(item => {
        const pubYear = new Date(item.volumeInfo.publishedDate).getFullYear() || 0;
        return (!minYear || pubYear >= minYear) && (!maxYear || pubYear <= maxYear);
      });
    }
    if (minRating) filteredItems = filteredItems.filter(item => (item.volumeInfo.averageRating || 0) >= minRating);

    
    const paginatedItems = filteredItems.slice(startIndex, startIndex + maxResults);
    const countResponse = await axios.get(
      `${process.env.GOOGLE_BOOKS_API_VOLUMES_URL}?q=intitle:${encodeURIComponent(q)}&startIndex=0&maxResults=0&key=${API_KEY}`
    );
    const rawTotal = countResponse.data.totalItems || 0;
    res.status(200).json({
      items: paginatedItems,
      totalItems: filteredItems.length,
      rawTotal
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
};




export const getNewReleasesByGenre = async (req, res) => {
  const { genre } = req.params;
  //console.log("genre recieved", genre)
  try {
    const response = await axios.get(process.env.GOOGLE_BOOKS_API_VOLUMES_URL, {
      params: {
        q: `subject:${genre}`,
        orderBy: 'newest',
        maxResults: 5,
        key: API_KEY
      }
    });

    const books = response.data.items?.map(item => ({
      id: item.id,
      title: item.volumeInfo.title || 'N/A',
      author: item.volumeInfo.authors?.join(', ') || 'N/A',
      coverImage: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196.png?text=No+Cover',
      releaseDate: item.volumeInfo.publishedDate || 'N/A',
      rating: item.volumeInfo.averageRating || 'N/A',
      ratings: item.volumeInfo.ratingsCount ? `${(item.volumeInfo.ratingsCount / 1000).toFixed(1)}K` : '0'
    })) || [];
    console.log("books",books);

    res.status(200).json(books);
  } catch (error) {
    console.error(`Error fetching new releases for ${genre}:`, error.message);
    res.status(500).json({ error: `Failed to fetch new releases for genre ${genre}` });
  }
};

export const getPopularByGenre = async (req, res) => {
  const { genre } = req.params;
  try {
    const response = await axios.get(process.env.GOOGLE_BOOKS_API_VOLUMES_URL, {
      params: {
        q: `subject:${genre}`,
        orderBy: 'relevance',
        maxResults: 3,
        key: API_KEY
      }
    });

    const books = response.data.items?.map(item => ({
      id: item.id,
      title: item.volumeInfo.title || 'N/A',
      author: item.volumeInfo.authors?.join(', ') || 'N/A',
      coverImage: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196.png?text=No+Cover',
      rating: item.volumeInfo.averageRating || 'N/A',
      ratings: item.volumeInfo.ratingsCount ? `${(item.volumeInfo.ratingsCount / 1000).toFixed(1)}K` : '0'
    })) || [];

    res.status(200).json(books);
  } catch (error) {
    console.error(`Error fetching popular books for ${genre}:`, error.message);
    res.status(500).json({ error: `Failed to fetch popular books for genre ${genre}` });
  }
};

export const insertBook = async (req, res) => {
  try {
    const {
      title, author, publisher, language,
      publicationYear, genre, description, pageCount,
      coverImageUrl, bookFileUrl
    } = req.body;

    await addbook(title, author, publisher, language,publicationYear, genre, description, pageCount, coverImageUrl, bookFileUrl)

    res.status(201).json({ message: 'Book inserted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB insert failed' });
  }
};