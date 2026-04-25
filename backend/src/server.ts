import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err: any) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
