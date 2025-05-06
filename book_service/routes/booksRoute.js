import express from "express";
import { getTrending, getBook, search, getRelatedBooks } from "../controllers/bookController.js";

const bookRouter=express.Router();

bookRouter.post('/trending', getTrending);
bookRouter.get('/getBook/:id', getBook);
bookRouter.get('/search', search);
bookRouter.get('/relatedBooks', getRelatedBooks);

export default bookRouter;