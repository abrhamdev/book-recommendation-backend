import express from "express";
<<<<<<< Updated upstream
import { getTrending, getBook, search, getRelatedBooks, getNewReleasesByGenre, getPopularByGenre} from "../controllers/bookController.js";
=======
import { getTrending, getBook, search, getRelatedBooks } from "../controllers/bookController.js";
import { getRecommendation } from "../controllers/recommendationController.js";
>>>>>>> Stashed changes

const bookRouter=express.Router();

bookRouter.post('/trending', getTrending);          //Is it really post?
bookRouter.get('/getBook/:id', getBook);
bookRouter.get('/search', search);
bookRouter.get('/relatedBooks', getRelatedBooks);
<<<<<<< Updated upstream
bookRouter.get('/new-releases/:genre', getNewReleasesByGenre);
bookRouter.get('/popular/:genre', getPopularByGenre);
=======
bookRouter.post('/recommend', getRecommendation);
>>>>>>> Stashed changes

export default bookRouter;