/**
 * @todo Write unit tests to login and signup pages and try different inputs.
 */
export default (authService, validationService, jwtService, config, faceDetectionService, uuidv4) => ({
  getLoginPage(req, res) {
    return res.render('login');
  },

  getRegisterPage(req, res) {
    return res.render('register');
  },

  async loginUser(req, res) {
    try {
      const { email, password, remember = false } = req.body;

      // validation service
      validationService.loginValidation({ email, password, remember });

      // auth service
      const authResult = await authService.loginUser(email, password);
      if (authResult === 'FACE_AUTH_REQUIRED') {
        const id = uuidv4();
        const { filename } = req.file;

        await faceDetectionService(id, filename, email);
      }

      // login user
      const nowUnixSeconds = Math.floor(Date.now() / 1000);
      const softExpiry = remember ? config.jwt.remember : config.jwt.softExpiry;
      const maxAge = remember ? config.jwt.remember : config.jwt.hardExpiry;
      const token = jwtService.createJwtToken(email, maxAge + nowUnixSeconds, softExpiry + nowUnixSeconds);

      // 'maxAge' (inbuilt properity) expiry time relative to the current time in milliseconds
      res.cookie('token', token, { maxAge: maxAge * 1000, httpOnly: true });
      return res.status(200).json({
        success: 'Login Success',
        token,
        redirect: '/dashboard',
      });
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
      });
    }
  },

  async registerUser(req, res) {
    try {
      const { username, email, password, confirmPassword, faceOpt = 'false' } = req.body;

      // validation service
      validationService.registerValidation({ username, email, password, confirmPassword, faceOpt });

      // auth service
      let encoding;
      if (faceOpt === 'true') {
        if (typeof req.file === 'undefined') {
          const err = new Error('Missing Face Image');
          err.status = 400;
          throw err;
        }
        const id = uuidv4();
        const { filename } = req.file;
        encoding = await faceDetectionService(id, filename);
      }
      const User = await authService.registerUser(username, email, password, faceOpt, encoding);

      return res.status(200).json({
        status: 201,
        User,
        success: 'Registration is successful'
      });
    } catch (err) {
      console.error(err);
      return res.status(err.status || 500).json({
        status: err.status,
        error: err.message || 'Internal Server Error',
      });
    }
  },
});
