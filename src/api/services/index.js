import Joi from '@hapi/joi';
import passwordComplexity from 'joi-password-complexity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../../config/index.js';
import makeValidationService from './validationService.js';
import makeAuthService from './authService.js';
import makeJwtService from './jwtService.js';
import makeFaceDetectionService from './faceDetectionService.js';
import User from '../../models/User.js';
import makeDbQueryService from './dbQueryService.js';
import py from './spawn.js';

export const validationService = makeValidationService(Joi, passwordComplexity);
export const dbQueryService = makeDbQueryService(User);
export const authService = makeAuthService(dbQueryService, bcrypt);
export const jwtService = makeJwtService(config, jwt);
export const faceDetectionService = makeFaceDetectionService(py, dbQueryService);

export default Object.freeze({
  validationService,
  authService,
  jwtService,
  faceDetectionService
});
