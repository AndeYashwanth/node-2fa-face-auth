/* module imports */
import { v4 as uuidv4 } from 'uuid';

/* models */
import User from '../../models/User.js';

import makeAuthController from './auth.js';
import makeUserController from './user.js';
import makeRootController from './root.js';
import config from '../../config/index.js';

// import services and send them to controllers
import { authService, validationService, jwtService, faceDetectionService } from '../services/index.js';

export const authController = makeAuthController(
  authService, validationService, jwtService, config, faceDetectionService, uuidv4
);
export const userController = makeUserController(User);
export const rootController = makeRootController();

export default Object.freeze({
  authController,
  userController,
  rootController
});
