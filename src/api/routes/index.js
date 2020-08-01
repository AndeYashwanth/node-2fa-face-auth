/**
 * Imports.
 */
// npm module imports
import express from 'express';

// Local module imports.
import makeRootRouter from './rootRoute.js';
import makeAuthRouter from './authRoute.js';
import makeUserRouter from './userRoute.js';
import { rootController, authController, userController } from '../controllers/index.js';
import imageUpload from '../../middlewares/imageUpload.js';

const { Router } = express;

export const rootRouter = makeRootRouter(Router(), rootController);
export const authRouter = makeAuthRouter(Router(), authController, imageUpload);
export const userRouter = makeUserRouter(Router(), userController);

export default Object.freeze({
  rootRouter,
  authRouter,
  userRouter
});
