import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import router from './routes';
import { generalLimiter } from './middlewares/limiter.middleware';

const app: Application = express();

const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

app.use(helmet()); 

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true
}));

app.use(generalLimiter);
app.use(express.json());
app.use(cookieParser());

app.use('/keeptab-api', router);

export default app;