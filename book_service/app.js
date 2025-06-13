import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bookRouter from './routes/booksRoute.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/books', bookRouter);
app.use('/api/ethbooks', bookRouter);

export default app;
