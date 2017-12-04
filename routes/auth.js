/* @params: controller object, and router
** @returns the router, with the routes attached
*/
module.exports = ({ controllers: { auth }, middlewares: { ensureUser }, router }) => {
  router

    .post('/logout', ensureUser, auth.postLogout)

    .post('/login', auth.postLogin)

    .post('/users', auth.postRegister)

    .put('/users/:id', auth.putUser)

  return router;
}
