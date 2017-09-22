module.exports = (ctx, next) => {
  ctx.body = ctx.body || {}
  const token = ctx.body.token || ctx.query.token || ctx.headers['x-access-token'];

  try {
   // jsonwebtoken should throw if can't verify https://github.com/auth0/node-jsonwebtoken
   const decoded = jwt.verify(token, config.tokenSecret);
   const user = User.findOne({ '_id': decoded.userId });

   if (!user) throw new Error('user not found');
   if (user.lastActive != decoded.lastActive) throw new Error('stale user');

   ctx.user = user;
   return next();
  }
  catch (err) {
   ctx.status = 403;

   ctx.body = {
     success: false,
     message: "Unauthorized",
     fullMessage: err.message
   }
  }

}
