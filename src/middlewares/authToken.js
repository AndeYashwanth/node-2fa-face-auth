import { jwtService } from '../api/services/index.js';

// https://stackoverflow.com/a/45515761/9160306
export default (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      error: { type: 'Authentication error', message: 'Auth token required.' }
    });
  }

  const result = jwtService.validateJwtToken(token);
  if (!result) {
    return res.status(401).json({
      error: { type: 'Authentication error', message: 'Invalid JWT Token' }
    });
  }

  const refreshedToken = jwtService.refreshJwtToken(result);
  if (refreshedToken) {
    // 'expires' Expiry date of the cookie in GMT. result.exp is unix seconds.
    res.cookie('token', refreshedToken, { expires: new Date(result.exp * 1000), httpOnly: true });
    req.cookies.token = refreshedToken;
  }
  req.user = { email: result.email };
  return next();
};
