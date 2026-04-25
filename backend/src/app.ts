import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middleware/errorMiddleware';
import { AppError } from './utils/AppError';
import routes from './routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
