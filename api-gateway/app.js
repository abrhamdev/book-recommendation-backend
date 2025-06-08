import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import proxy from 'express-http-proxy';
import validateForm from './middlewares/validateForm.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();


const allowedOrigins = [
  'https://novareads.netlify.app',
  'http://localhost:4000' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());


app.post('/users/signup', validateForm , proxy(process.env.USERS_SERVICE));
app.post('/users/login', proxy(process.env.USERS_SERVICE));
app.post('/users/google-signin', proxy(process.env.USERS_SERVICE));
app.post('/users/me',authMiddleware, proxy(process.env.USERS_SERVICE));
app.post('/users/me/profile',authMiddleware, proxy(process.env.USERS_SERVICE));
app.post('/users/me/preference',authMiddleware, proxy(process.env.USERS_SERVICE));

app.post('/books/trending',proxy(process.env.BOOKS_SERVICE));
app.get(`/books/getBook/:id`,proxy(process.env.BOOKS_SERVICE));
app.get(`/books/search`,proxy(process.env.BOOKS_SERVICE));
app.get(`/books/relatedBooks`,proxy(process.env.BOOKS_SERVICE));
app.get(`/books/new-releases/:genre`,proxy(process.env.BOOKS_SERVICE));
app.get(`/books/popular/:genre`,proxy(process.env.BOOKS_SERVICE));



app.get(`/books/reviews/:id`,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post(`/books/setReview`,authMiddleware,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post(`/books/reviews/react`,authMiddleware,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post(`/books/report/book`,authMiddleware,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post(`/books/report/review`,authMiddleware,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post(`/books/review/reply`,authMiddleware,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post(`/community/bookclub/create`,authMiddleware,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post(`/community/bookclub/joined`,authMiddleware,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post(`/community/bookclub/members`,authMiddleware,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post(`/community/bookclub/join`,authMiddleware,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.get(`/community/bookclub/fetchclubs`,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post(`/community/bookclub/messages`,authMiddleware,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));


export default app;
