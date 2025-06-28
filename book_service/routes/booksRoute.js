import express from "express";
import { getTrending, getBook, search, getRelatedBooks, getNewReleasesByGenre, getPopularByGenre, insertBook, getLocalBook,allBooks  } from "../controllers/bookController.js";
import { getRecommendation } from "../controllers/recommendationController.js";
import { uploadMiddleware, processFiles } from '../middlewares/FileUpload.js';
import { checkBookExists} from '../middlewares/checkBookExists.js';
import {
    addToReadingListController,
    getReadingListController,
    updateReadingStatusController,
    removeFromReadingListController,
    checkBookInReadingListController
  } from "../controllers/readingListController.js";
import { toggleFavoriteController, getFavoritesController } from "../controllers/favoriteController.js";
import {authMiddleware} from '../middlewares/authMiddleware.js';

const bookRouter=express.Router();

bookRouter.post('/trending', getTrending);          //Is it really post?
bookRouter.get('/getBook/:id', getBook);
bookRouter.get('/search', search);
bookRouter.get('/relatedBooks', getRelatedBooks);
bookRouter.get('/new-releases/:genre', getNewReleasesByGenre);
bookRouter.get('/popular/:genre', getPopularByGenre);
bookRouter.post('/recommend', getRecommendation);
bookRouter.post('/insertbook', uploadMiddleware,checkBookExists, processFiles, insertBook);
bookRouter.get('/local/:id', getLocalBook);

bookRouter.post('/reading-list', authMiddleware, addToReadingListController);
bookRouter.get('/reading-list', authMiddleware, getReadingListController);
bookRouter.patch('/reading-list/:bookId', authMiddleware, updateReadingStatusController);
bookRouter.delete('/reading-list/:bookId',authMiddleware, removeFromReadingListController);
bookRouter.get('/reading-list/check/:bookId', authMiddleware, checkBookInReadingListController);
bookRouter.post('/favorites/:bookId/toggle', authMiddleware, toggleFavoriteController);
bookRouter.get('/favorites', authMiddleware, getFavoritesController);
bookRouter.get('/getallbooks', allBooks);

export default bookRouter;