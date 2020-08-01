// npm module imports
import express from 'express';
import expressLayouts from 'express-ejs-layouts'; // .ejs files
import morgan from 'morgan'; // request logger
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { join, resolve } from 'path';

// local module imports
import config from '../config/index.js';
import { rootRouter, authRouter, userRouter } from '../api/routes/index.js';
// import authToken from '../middlewares/authToken.js';

export default (app) => {
  /**
   * Health Check endpoints
   */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // Enable Cross Origin Resource Sharing
  app.use(cors({ origin: config.allowedOrigins }));

  // populate cookies at req.cookies
  app.use(cookieParser());

  // making 'public' folder public
  app.use(express.static(join(resolve(), '../public')));

  // logging
  app.use(morgan('tiny')); // or 'combined'

  // EJS
  app.use(expressLayouts);
  app.set('view engine', 'ejs');
  app.set('views', join(resolve(), '../views'));

  // body parser
  app.use(express.urlencoded({ extended: false }));

  // routes
  // use authToken middleware for jwt.
  app.use('/', rootRouter);
  app.use('/auth', authRouter);
  app.use('/user', userRouter);

  // error handler middleware
  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: { status: 500, message: error.message || 'Internal Server error' } });
  });
};
