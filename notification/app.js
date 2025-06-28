import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectMongoDB from './config/mongodb.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
connectMongoDB();

export default app;
