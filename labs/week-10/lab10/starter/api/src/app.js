import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

  app.use(cors({
    origin: config.corsOrigin
  }));

  app.use(express.json());

  app.use('/api/requests', requestRoutes);
  app.use('/api/users', userRoutes);

  app.use(errorHandler);

  return app;
}
