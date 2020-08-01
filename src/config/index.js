import dotenv from 'dotenv'; // load environment variables from .env file

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
const host = process.env.APP_HOST || 'localhost';
const port = parseInt(process.env.APP_PORT || 3000, 10);
const allowedOrigins = JSON.parse(process.env.APP_ALLOWED_ORIGINS || JSON.stringify([`http://localhost:${port}`]));
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/faceauth';
const secret = process.env.JWT_SECRET || 'super secret string';
const softExpiry = parseInt(process.env.JWT_SOFT_EXPIRY || 300, 10);
const hardExpiry = parseInt(process.env.JWT_HARD_EXPIRY || 3000, 10);
const rememberExpiry = parseInt(process.env.JWT_REMEMBER_EXPIRY || 36000, 10);

export default {
  /**
   * Nodejs server port.
   */
  host,
  port,
  allowedOrigins,
  /**
   * New monogdb conneciton url.
   */
  dbUrl,

  /**
   * reason for hard and soft expiry -> https://stackoverflow.com/a/45515761/9160306
   */
  jwt: {
    secret,
    softExpiry, // in sec
    hardExpiry, // in seconds
    rememberExpiry // in sec
  }
};
