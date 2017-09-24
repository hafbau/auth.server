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
const db = require('mongoose').connect(config.db, { useMongoClient: true });
const middlewares = require('./middlewares')();

const models = require('./models')(db);
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

// =======================
// start the server ======
// =======================
const PORT = 3000;
server.listen(PORT, () => console.log(`listening on port ${PORT} on ${process.env.NODE_ENV} enviroment.`));
