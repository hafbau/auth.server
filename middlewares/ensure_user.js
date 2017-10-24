const jwt = require('jsonwebtoken');
const tokenSecret = require('../config').tokenSecret;

module.exports = ({ User }) => async (ctx, next) => {
  ctx.body = ctx.body || {}
  const token = ctx.body.token || ctx.query.token || ctx.headers['x-access-token'];
  console.log('token in middleware', ctx.body)
  try {
    // jsonwebtoken should throw if can't verify https://github.com/auth0/node-jsonwebtoken
    const decoded = jwt.verify(token, tokenSecret);
    const user = await User.findOne({ '_id': decoded.userId });
    console.log('token in middleware', user, 'lastActive', user.lastActive)
   if (!user) throw new Error('user not found');
   if (user.lastActive != decoded.lastActive) throw new Error('stale user');
    ctx.user = user;
    return next();
  }
  catch (err) {
    console.log('error in ensure user middleware', err)    
    return next();
  }

}
