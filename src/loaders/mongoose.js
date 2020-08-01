import mongoose from 'mongoose';
import config from '../config/index.js';

export default async () => {
  try {
    await mongoose.connect(config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Mongodb connected.');
  } catch (err) {
    console.error('mongodb connection error.', err);
    process.exit(1);
  }
};
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});
