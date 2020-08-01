export default (config, jwt) => ({
  /**
 * @param {string} email
 * @param {Number} exp seconds since unix epoch
 * @param {Number} [softExpiry=undefined] seconds since unix epoch
 */
  createJwtToken(email, exp, softExpiry = undefined) {
    const nowUnixSeconds = Math.floor(Date.now() / 1000);

    if (!softExpiry) softExpiry = config.jwt.softExpiry + nowUnixSeconds;

    // Create a new token
    return jwt.sign({ softExpiry, exp, email }, config.jwt.secret, { algorithm: 'HS256' });
  },

  /**
 * @param {string} token
 * @returns {JSON|false}
 * @throws {jwt.JsonWebTokenError}
 */
  validateJwtToken(token) {
    try {
      // This method will throw an error if the token is invalid (if it has expired according to the expiry time
      // we set on sign in), or if the signature does not match
      return jwt.verify(token, config.jwt.secret);
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return false;
      }
      // otherwise bubble up.
      e.status = 500;
      throw e;
    }
  },

  /**
 * Doesn't validate the token. Need to validate before sending the token.
 * @param {JSON} decodedToken
 * @returns {string|false}
 */
  refreshJwtToken(decodedToken) {
    const nowUnixSeconds = Math.floor(Date.now() / 1000);
    // if current time exceeds soft expiry time. create new token.
    if (nowUnixSeconds > decodedToken.softExpiry) {
      // create token without modifying expiry(hard) time.
      return this.createJwtToken(decodedToken.email, decodedToken.exp);
    }
    // otherwise no need.
    return false;
  }
});
