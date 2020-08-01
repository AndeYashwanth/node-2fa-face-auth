export default (dbQueryService, bcrypt) => ({
  /**
 * @throws when email doesn't exists in database/passwords doesnt match
 * @returns {String}
 */
  loginUser: async (email, password) => {
    // check in db if user exists
    const dbUser = await dbQueryService.findUserByEmail(email);
    if (dbUser) {
      const match = await bcrypt.compare(password, dbUser.password);
      if (match) {
        // If user opted in for face recognition auth
        if (dbUser.faceOpt) {
          return 'FACE_AUTH_REQUIRED';
        }
        return 'AUTH_SUCCESS';
      }
    }
    // User not found (or) found but password not matched
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  },
  /**
 * Store user in  database.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {boolean} faceOpt
 * @param {Array} faceEncoding
 * @returns {User} returns User on successful registration.
 */
  registerUser: async (username, email, password, faceOpt, faceEncoding) => {
    const dbUser = await dbQueryService.findUserByEmail(email);
    if (dbUser) {
      // user already exists.
      const err = new Error('User already exists');
      err.status = 409;
      throw err;
    }

    // hash and salt password
    const saltRounds = 8;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    if (!hashPassword) {
      const err = new Error('Unable to hash password');
      err.status = 500;
      throw err;
    }

    // add to database
    const saveUser = await dbQueryService.createUser({
      username,
      email,
      password: hashPassword,
      faceOpt,
      faceEncoding
    });
    if (!saveUser) {
      const err = new Error('Unable to save user to database');
      err.status = 504;
      throw err;
    }
    // insert success
    return saveUser;
  }
});
