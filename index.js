const Koa = require('koa');
const bodyParser = require('koa-body');
const jwt = require('jsonwebtoken');
const router = require('koa-router')();
const render = require('koa-send');
const morgan = require('koa-morgan');
const helmet = require('koa-helmet');

// =======================
// configuration =========
// =======================
const app = new Koa();
const config = require('./config');
const db = require('mongoose');
db.Promise = Promise;
db.connect(config.db, { useMongoClient: true });
const models = require('./models')(db);
const controllers = require('./controllers')(models, render);
const middlewares = require('./middlewares')(models);
const { combinedRoutes } = require('./routes')({ controllers, middlewares, router });

// =======================
// END configuration =====
// =======================


// =======================
// setting up app ========
// =======================

// cross-origin set up
app.use(middlewares.cors);

// set up security, logging and body
// app.use(helmet);
app.use(morgan('dev'));
app.use(bodyParser({ multipart: true }));

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
const PORT = 4001;
server.listen(PORT, () => console.log(`listening on port ${PORT} on ${process.env.NODE_ENV} enviroment.`));

module.exports = {
    server,
    db
};