import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { NotificationManager, EmailNotificationObserver, InAppNotificationObserver } from './patterns/Observer.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Setup Observers (Singleton)
const notificationManager = NotificationManager.getInstance();
notificationManager.attach(new EmailNotificationObserver());
notificationManager.attach(new InAppNotificationObserver());

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SkillBridge API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
