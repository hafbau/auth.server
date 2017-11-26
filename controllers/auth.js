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
      try {
        const { request: { body: { fields } } } = ctx;
        let data = fields ? fields : ctx.request.body;
        if (typeof data === 'string') data = JSON.parse(data)
        let user = await User.authenticate(data);

        if (user) {
          const token = jwt.sign({
            userId: user._id,
            lastActive: user.lastActive },
            tokenSecret
          );
          ctx.status = 200;
          const meta = user.meta;
          
          delete user.meta;
          delete meta.password;
          user = Object.assign({}, user._doc, meta)
          
          console.log('user logged in', user)

          return ctx.body = {
            success: true,
            token,
            user
          };
        }
        // no user
        throw new Error();
      }
      catch(err) {
        ctx.status = 403;
        return ctx.body = {
          success: false,
          message: 'User authentication failed',
          fullMessage: err.message
        };

      }
    },

    postRegister: async (ctx) => {
      try {
        const { request: { body: { fields } } } = ctx;
        let data = fields ? fields : ctx.request.body;
        // this due to non-form data
        if (typeof data === 'string') data = JSON.parse(data)    
        const user = await User.create(data);
        console.log('user in postRegister', user)
        if (user) {
          const token = jwt.sign({
            userId: user._id,
            lastActive: user.lastActive },
            tokenSecret
          );
          ctx.status = 200;
          const meta = user.meta;
          delete user.meta;
          delete meta.password;

          return ctx.body = {
            success: true,
            token,
            user: Object.assign({}, user._doc, meta)
          };
        }
        // no user
        throw new Error();
      }
      catch (err) {
        ctx.status = 400;
        return ctx.body = {
          success: false,
          message: 'User registration failed',
          fullMessage: err.message
        };

      }
    }
  }
}
