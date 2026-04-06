import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import router from './routes';

const app: Application = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas peticiones. Por favor, descansa y vuelve en 15 minutos...'
  }
});

app.use(helmet());
app.use(limiter);
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/keeptab-api', router);

export default app;