/* Exports */
export default function makeAuthRouter(router, userController) {
    //get requests
    //redirect to his own username
    router.get('/', userController.redirectToOwnUsername);

    //dashboard
    router.get('/dashboard', userController.getDashboardPage);

    //show info about user.
    router.get('/:id', userController.getUserDetails);

    return router;
}