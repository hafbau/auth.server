const config = require('../../config');

// should try stubbing with sinon later to prevent actual database access
const mongoose = require('mongoose');
mongoose.Promise = Promise;

module.exports = function(db) {
    if (!db) db = mongoose;
    require('tap').mochaGlobals();

    beforeEach(function (done) {
        function clearDB() {
            for (let i in db.connection.collections) {
                db.connection.collections[i].remove(function () { });
            }
            return done();
        }

        if (db.connection.readyState === 0) {// not connected
            db.connect(config.db, { useMongoClient: true }, function (err) {
                if (err) {
                    throw err;
                }
                return clearDB();
            });
        } else {// already connected
            return clearDB();
        }
    });

    afterEach(function (done) {
        db.disconnect();
        return done();
    });

    return db;
};
