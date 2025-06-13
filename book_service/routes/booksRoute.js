import express from "express";
import { getTrending, getBook, search, getRelatedBooks, getNewReleasesByGenre, getPopularByGenre, insertBook} from "../controllers/bookController.js";
import { getRecommendation } from "../controllers/recommendationController.js";
import { uploadMiddleware, processFiles } from '../middlewares/FileUpload.js';
import { checkBookExists} from '../middlewares/checkBookExists.js';

const bookRouter=express.Router();

bookRouter.post('/trending', getTrending);          //Is it really post?
bookRouter.get('/getBook/:id', getBook);
bookRouter.get('/search', search);
bookRouter.get('/relatedBooks', getRelatedBooks);
bookRouter.get('/new-releases/:genre', getNewReleasesByGenre);
bookRouter.get('/popular/:genre', getPopularByGenre);
bookRouter.post('/recommend', getRecommendation);
bookRouter.post('/insertbook', uploadMiddleware,checkBookExists, processFiles, insertBook);

export default bookRouter;