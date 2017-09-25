const jwt = require('jsonwebtoken');
const tokenSecret = require('../config').tokenSecret;

module.exports = ({ User }, render) => {
  return {

    postLogout: async (ctx) => {
      if (ctx.user) {
        ctx.user.lastActive = Date.now();
        ctx.user.loggedIn = false;
        ctx.user.save();

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

    postLogin: async (ctx) => {
      const { request: { body: { fields } } } = ctx;
      let data = fields ? fields : ctx.request.body;
      if (typeof data === 'string') data = JSON.parse(data)
      const user = await User.authenticate(data);

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
      const { request: { body: { fields } } } = ctx;
      let data = fields ? fields : ctx.request.body;
      // this due to non-form data
      if (typeof data === 'string') data = JSON.parse(data)    
      const user = await User.create(data);
      
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
      ctx.status = 400;
      return ctx.body = {
        success: false,
        message: 'User registration failed'
      };
    }
  }
}
