const jwt = require('jsonwebtoken');
const tokenSecret = require('../config').tokenSecret;

module.exports = ({ User }, render) => {
  return {
    getLogin: async (ctx) => {
      ctx.body = '<h1>Login Page</h1>'
    },

    getLogout: async (ctx) => {
      if (ctx.user) {
        ctx.user.lastActive = Date.now();
        ctx.user.loggedIn = false;
        User.save(ctx.user);

        ctx.status = 200;
        return ctx.body = {
          success: true,
          loggedIn: false
        }
      }
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: "Not Found",
        fullMessage: "Not logged in"
      }
    },

    getRegister: async (ctx) => {
      ctx.body = User.find();
    },

    postLogin: async (ctx) => {
      const { request: { body }, res } = ctx;
      const user = User.authenticate(body);

      if (user) {
        const token = jwt.sign({
          userId: user._id,
          lastActive: user.lastActive },
          tokenSecret
        );
        ctx.status = 200;

        return ctx.body = {
          success: true,
          token,
          user
        };
      }
      ctx.status = 403;
      return ctx.body = {
        success: false,
        message: 'User authentication failed'
      };
    },

    postRegister: async (ctx) => {
      const { request: { body }, res } = ctx;
      const user = User.create(body);

      if (user) {
        const token = jwt.sign({
          userId: user._id,
          lastActive: user.lastActive },
          tokenSecret
        );
        ctx.status = 200;

        return ctx.body = {
          success: true,
          token,
          user
        };
      }
      ctx.status = 403;
      return ctx.body = {
        success: false,
        message: 'User registration failed'
      };
    }
  }
}
