import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import setupSocket from './socket.js';
import reviewRouter from './routes/reviewRoute.js';
import communityRouter from './routes/communityRoute.js';
import connectMongoDB from './config/mongodb.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
connectMongoDB();
setupSocket(server);

app.use('/books', reviewRouter);
app.use('/community', communityRouter);

export default server;
