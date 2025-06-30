import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import adminRouter from './routes/adminRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/admin', adminRouter);

export default app;
