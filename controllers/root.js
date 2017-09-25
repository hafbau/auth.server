const jwt = require('jsonwebtoken');
const tokenSecret = require('../config').tokenSecret;

module.exports = ({ User }, render) => {
  return {
    getRoot: async (ctx, next) => {
      const { req, res, user } = ctx;
      if (user) {
        ctx.status = 200;
        ctx.body = {
          user,
          loggedIn: true
        }
      } else {
        ctx.status = 403;
        ctx.body = {
          loggedIn: false
        }
      }

      // return next();
    },

  }
}
