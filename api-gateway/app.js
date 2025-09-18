/*import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import proxy from 'express-http-proxy';
import validateForm from './middlewares/validateForm.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import {authMiddlewareForPopulation} from './middlewares/authMiddlewareForPopulation.js'

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

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.post('/users/signup', validateForm , proxy(process.env.USERS_SERVICE));
app.post('/users/login', proxy(process.env.USERS_SERVICE));
app.post('/users/change-password', proxy(process.env.USERS_SERVICE));
app.post('/users/google-signin', proxy(process.env.USERS_SERVICE));
app.post('/users/me',authMiddleware, proxy(process.env.USERS_SERVICE));
app.post('/users/me/profile',authMiddleware, proxy(process.env.USERS_SERVICE));
app.post('/users/me/updateProfile',authMiddleware, proxy(process.env.USERS_SERVICE));
app.post('/users/me/preference',authMiddleware, proxy(process.env.USERS_SERVICE));
app.post('/users/me/updatePreference',authMiddleware, proxy(process.env.USERS_SERVICE));
app.post('/users/me/fetchPreferences',authMiddleware, proxy(process.env.USERS_SERVICE));
app.post('/users/me/upload-profile-picture', proxy(process.env.USERS_SERVICE, {
  limit: '100mb', 
  proxyReqBodyDecorator: (body, srcReq) => body,
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    proxyReqOpts.headers['Content-Type'] = srcReq.headers['content-type'];
    return proxyReqOpts;
  },
  preserveReqSession: true,
  parseReqBody: false 
}));

app.post('/books/trending',proxy(process.env.BOOKS_SERVICE));
app.get(`/books/getBook/:id`,proxy(process.env.BOOKS_SERVICE));
app.get(`/books/search`,proxy(process.env.BOOKS_SERVICE));
app.get(`/books/relatedBooks`,proxy(process.env.BOOKS_SERVICE));
app.get(`/books/new-releases/:genre`,proxy(process.env.BOOKS_SERVICE));
app.get(`/books/popular/:genre`,proxy(process.env.BOOKS_SERVICE));
app.post(`/books/recommend`,authMiddleware,proxy(process.env.BOOKS_SERVICE));
app.post('/api/ethbooks/insertbook',
  authMiddlewareForPopulation,
  proxy(process.env.BOOKS_SERVICE, {
    limit: '100mb', 
    proxyReqBodyDecorator: (body, srcReq) => body,
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      proxyReqOpts.headers['Content-Type'] = srcReq.headers['content-type'];
      return proxyReqOpts;
    },
    preserveReqSession: true,
    parseReqBody: false 
  })
);
app.get(`/books/local/:id`,proxy(process.env.BOOKS_SERVICE));


//Authentication is handled in the service
app.post('/books/reading-list',proxy(process.env.BOOKS_SERVICE));
app.get('/books/reading-list',proxy(process.env.BOOKS_SERVICE));
app.patch('/books/reading-list/:bookId', proxy(process.env.BOOKS_SERVICE));
app.delete('/books/reading-list/:bookId',proxy(process.env.BOOKS_SERVICE));
app.post('/books/favorites/:bookId/toggle', proxy(process.env.BOOKS_SERVICE));
app.get('/books/favorites', proxy(process.env.BOOKS_SERVICE));
app.get('/books/reading-list', proxy(process.env.BOOKS_SERVICE));

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
app.post(`/community/bookclub/setcurrentbook`,authMiddleware,proxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));

app.get('/admin/stats', proxy(process.env.ADMIN_PANEL));
app.get('/admin/fetchusers', proxy(process.env.ADMIN_PANEL));
app.get('/admin/books', proxy(process.env.ADMIN_PANEL));
app.get('/admin/books/reviews', proxy(process.env.ADMIN_PANEL));
export default app;

*/

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import proxy from 'express-http-proxy';
import validateForm from './middlewares/validateForm.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import { authMiddlewareForPopulation } from './middlewares/authMiddlewareForPopulation.js';

dotenv.config();

const app = express();

// CORS setup
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

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ---------------- Queue Implementation ----------------
const requestQueue = [];
let isProcessingQueue = false;
const QUEUE_INTERVAL_MS = 200; // delay between requests (adjust as needed)

function enqueueRequest(req, res, target, options) {
  requestQueue.push({ req, res, target, options });
  if (!isProcessingQueue) processQueue();
}

function processQueue() {
  if (requestQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }

  isProcessingQueue = true;
  const { req, res, target, options } = requestQueue.shift();

  // Call the proxy with the original request
  proxy(target, options)(req, res, () => {});

  // Process the next request after interval
  setTimeout(processQueue, QUEUE_INTERVAL_MS);
}

// ---------------- Proxy Wrappers ----------------
function queueProxy(target, options = {}) {
  return (req, res) => enqueueRequest(req, res, target, options);
}

// ---------------- Routes ----------------

// USERS SERVICE
app.post('/users/signup', validateForm , queueProxy(process.env.USERS_SERVICE));
app.post('/users/login', queueProxy(process.env.USERS_SERVICE));
app.post('/users/change-password', queueProxy(process.env.USERS_SERVICE));
app.post('/users/google-signin', queueProxy(process.env.USERS_SERVICE));
app.post('/users/me', authMiddleware, queueProxy(process.env.USERS_SERVICE));
app.post('/users/me/profile', authMiddleware, queueProxy(process.env.USERS_SERVICE));
app.post('/users/me/updateProfile', authMiddleware, queueProxy(process.env.USERS_SERVICE));
app.post('/users/me/preference', authMiddleware, queueProxy(process.env.USERS_SERVICE));
app.post('/users/me/updatePreference', authMiddleware, queueProxy(process.env.USERS_SERVICE));
app.post('/users/me/fetchPreferences', authMiddleware, queueProxy(process.env.USERS_SERVICE));
app.post('/users/me/upload-profile-picture', queueProxy(process.env.USERS_SERVICE, {
  limit: '100mb',
  proxyReqBodyDecorator: (body, srcReq) => body,
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    proxyReqOpts.headers['Content-Type'] = srcReq.headers['content-type'];
    return proxyReqOpts;
  },
  preserveReqSession: true,
  parseReqBody: false
}));

// BOOKS SERVICE
app.post('/books/trending', queueProxy(process.env.BOOKS_SERVICE));
app.get('/books/getBook/:id', queueProxy(process.env.BOOKS_SERVICE));
app.get('/books/search', queueProxy(process.env.BOOKS_SERVICE));
app.get('/books/relatedBooks', queueProxy(process.env.BOOKS_SERVICE));
app.get('/books/new-releases/:genre', queueProxy(process.env.BOOKS_SERVICE));
app.get('/books/popular/:genre', queueProxy(process.env.BOOKS_SERVICE));
app.post('/books/recommend', authMiddleware, queueProxy(process.env.BOOKS_SERVICE));
app.post('/api/ethbooks/insertbook', authMiddlewareForPopulation, queueProxy(process.env.BOOKS_SERVICE, {
  limit: '100mb',
  proxyReqBodyDecorator: (body, srcReq) => body,
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    proxyReqOpts.headers['Content-Type'] = srcReq.headers['content-type'];
    return proxyReqOpts;
  },
  preserveReqSession: true,
  parseReqBody: false
}));
app.get('/books/local/:id', queueProxy(process.env.BOOKS_SERVICE));
app.post('/books/reading-list', queueProxy(process.env.BOOKS_SERVICE));
app.get('/books/reading-list', queueProxy(process.env.BOOKS_SERVICE));
app.patch('/books/reading-list/:bookId', queueProxy(process.env.BOOKS_SERVICE));
app.delete('/books/reading-list/:bookId', queueProxy(process.env.BOOKS_SERVICE));
app.post('/books/favorites/:bookId/toggle', queueProxy(process.env.BOOKS_SERVICE));
app.get('/books/favorites', queueProxy(process.env.BOOKS_SERVICE));
app.get('/books/reading-list', queueProxy(process.env.BOOKS_SERVICE));

// COMMUNITY & REVIEW SERVICE
app.get('/books/reviews/:id', queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post('/books/setReview', authMiddleware, queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post('/books/reviews/react', authMiddleware, queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post('/books/report/book', authMiddleware, queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post('/books/report/review', authMiddleware, queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post('/books/review/reply', authMiddleware, queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post('/community/bookclub/create', authMiddleware, queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post('/community/bookclub/joined', authMiddleware, queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post('/community/bookclub/members', authMiddleware, queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post('/community/bookclub/join', authMiddleware, queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.get('/community/bookclub/fetchclubs', queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post('/community/bookclub/messages', authMiddleware, queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));
app.post('/community/bookclub/setcurrentbook', authMiddleware, queueProxy(process.env.COMMUNITY_AND_REVIEW_SERVICE));

// ADMIN PANEL
app.get('/admin/stats', queueProxy(process.env.ADMIN_PANEL));
app.get('/admin/fetchusers', queueProxy(process.env.ADMIN_PANEL));
app.get('/admin/books', queueProxy(process.env.ADMIN_PANEL));
app.get('/admin/books/reviews', queueProxy(process.env.ADMIN_PANEL));

export default app;
