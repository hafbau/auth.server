const jwt = require('jsonwebtoken');
const tokenSecret = require('../config').tokenSecret;

module.exports = ({ User }) => async (ctx, next) => {
  ctx.body = ctx.body || {};
  const token = ctx.body.token || ctx.query.token || ctx.headers['x-access-token'];
  try {
    // jsonwebtoken should throw if can't verify https://github.com/auth0/node-jsonwebtoken
    const decoded = jwt.verify(token, tokenSecret);
    const user = await User.findOne({ '_id': decoded.userId });
    if (!user) throw new Error('user not found');
  
    if (!ctx.path.includes('logout') && user.lastActive != decoded.lastActive) throw new Error('stale user');
    // this is a mongoose object not the _doc
    ctx.user = user;
    return next();
  }
  catch (err) {
    console.log('error in ensure user middleware', err)    
    return next();
  }

}
