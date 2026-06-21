import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import router from './routes';
import { generalLimiter } from './middlewares/limiter.middleware';

const app: Application = express();

app.set('trust proxy', 1);

app.use(helmet()); 

app.use(cors({ 
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(generalLimiter);
app.use(express.json());
app.use(cookieParser());

app.use(router);

export default app;