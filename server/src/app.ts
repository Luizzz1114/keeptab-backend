import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';
import { generalLimiter } from './middlewares/limiter.middleware';

const app: Application = express();

app.use(helmet());
app.use(generalLimiter);
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/keeptab-api', router);

export default app;