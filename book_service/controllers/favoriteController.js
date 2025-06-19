import { toggleFavorite, getFavorites } from "../models/FavouriteModel.js";

export const toggleFavoriteController = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.userId;
    
    const result = await toggleFavorite(userId, bookId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to toggle favorite' });
  }
};

export const getFavoritesController = async (req, res) => {
  try {
    const userId = req.userId;
    const favorites = await getFavorites(userId);
    res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to get favorites' });
  }
};
