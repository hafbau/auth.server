/* @params: controller object, middlewares and router
** @returns the router, with the routes attached
*/
module.exports = ({ controllers: { root }, middlewares: { ensureUser }, router }) => {
  router
    .get('/', ensureUser, root.getRoot)

    return router;
}
