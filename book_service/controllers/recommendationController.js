import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/*Final code for Content-Based filtering */
import { convertToDirectUrl } from '../services/driveService.js';
import { getReadingListByUserId } from '../models/ReadingListModel.js';

export const getRecommendation = async (req, res) => {
  const { userId } = req.body;
  try {
    // Fetch reading list and extract local book IDs
    const readingList = await getReadingListByUserId(userId);
    const readingIds = readingList
      .filter((item) => item.bookId.startsWith('local-'))
      .map((item) => Number(item.bookId.replace('local-', '')))
      .filter((id) => !isNaN(id));

    // console.log("readingList:", readingList);
    // console.log("readingIds:", readingIds);

    let localBooks = [];

    if(readingIds.length > 0) {
    // Fetch recommendations from RECOMMENDATION_ENGINE_INDEX
    const localRecommendations = await axios.post(
      `${process.env.RECOMMENDATION_ENGINE_INDEX}/recommend`,
      { read_ids: readingIds, k: 5 },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Transform local recommendations, converting thumbnail URLs
      localBooks = localRecommendations.data.map((book) => ({
      ...book,
      thumbnail: convertToDirectUrl(book.thumbnail),
    }));
      //console.log("localRecommendations:", localBooks);
    } else {
      localBooks = [];
    }

    // Fetch preference-based recommendations
    const preferenceBooks = await getRecommendationA(req);
    console.log("preferenceRecommendations:", preferenceBooks);

    // Combine recommendations, removing duplicates by id or isbn
    const combinedBooks = [...localBooks, ...preferenceBooks];

    // Return combined recommendations
    return res.status(200).json({ books: combinedBooks });
  } catch (error) {
    console.error("Error in getRecommendation:", error.message);
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};

export const getRecommendationA = async (req) => {
  const { userId } = req.body;
  try {
    // Fetch user preferences
    const userPreference = await axios.get(
      `${process.env.USERS_SERVICE}/users/me/getPreference?userId=${userId}`
    );
    const preference = userPreference.data;

    // Fetch recommendations from RECOMMENDATION_ENGINE
    const recommendations = await axios.post(
      `${process.env.RECOMMENDATION_ENGINE}/recommend`,
      preference,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const recommendedISBNs = recommendations.data.books;

    // Fetch book details from Google Books API
    const books = await Promise.all(
      recommendedISBNs.map(async (isbn) => {
        try {
          const response = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
          );
          const items = response.data.items;
          if (items && items.length > 0) {
            const book = items[0].volumeInfo;
            return {
              id: items[0].id,
              title: book.title,
              authors: book.authors || [],
              description: book.description || '',
              publisher: book.publisher || '',
              publishedDate: book.publishedDate || '',
              pageCount: book.pageCount || null,
              categories: book.categories || [],
              language: book.language || '',
              thumbnail: book.imageLinks?.thumbnail || '',
              previewLink: book.previewLink || '',
              isbn: isbn,
            };
          }
        } catch (err) {
          console.error(`Error fetching book for ISBN ${isbn}:`, err.message);
        }
        return null;
      })
    );

    // Filter out null results
    return books.filter((book) => book !== null);
  } catch (error) {
    console.error("Error in getRecommendationA:", error.message);
    return [];
  }
};