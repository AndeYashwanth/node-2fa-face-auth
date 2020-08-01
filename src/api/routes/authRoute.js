/* Exports */
export default function makeAuthRouter(router, authController, imageUpload) {
  // get requests
  router.get('/login', authController.getLoginPage);

  router.get('/register', authController.getRegisterPage);

  // post requests
  router.post('/login', imageUpload.single('faceImage'), authController.loginUser);

  router.post('/register', imageUpload.single('faceImage'), authController.registerUser);

  return router;
}
