/* Exports */
export default function makeRootRouter(router, rootController) {
    //get requests
    router.get('/', rootController.getRootPage);

    return router;
}