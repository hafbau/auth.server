const Koa = require('koa');
const bodyParser = require('koa-body');
const jwt = require('jsonwebtoken');
const router = require('koa-router')();
const render = require('koa-send');

// =======================
// configuration =========
// =======================
const app = new Koa();
const config = require('./config');
const middlewares = require('./middlewares')();

const models = require('./models');
const controllers = require('./controllers')(models, render);
const { combinedRoutes } = require('./routes')({controllers, middlewares, router});

// =======================
// END configuration =====
// =======================


// =======================
// setting up app ========
// =======================

// set up req.body
app.use(bodyParser());

// set up app routes
app.use(combinedRoutes);

// creates http server from app, and attach the io (realtime) middleware to app,
const { io, server } = require('./io')(app);

// =======================
// END setting up app ====
// =======================

// TODO: remove this block post development
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    console.log('message received', msg);
    io.emit('chat message', msg);
  })

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// =======================
// start the server ======
// =======================
const PORT = 3000;
server.listen(PORT, () => console.log(`listening on port ${PORT} on ${process.env.NODE_ENV} enviroment.`));
