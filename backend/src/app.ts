import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Centralized Error Handling
app.use(errorHandler);

export default app;
