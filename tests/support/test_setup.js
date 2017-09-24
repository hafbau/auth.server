const config = require('../../config');

// should try stubbing with sinon later to prevent actual database access
const mongoose = require('mongoose');
mongoose.Promise = Promise;

module.exports = (function() {
    require('tap').mochaGlobals();

    beforeEach(function (done) {
        function clearDB() {
            for (let i in mongoose.connection.collections) {
                mongoose.connection.collections[i].remove(function () { });
            }
            return done();
        }

        if (mongoose.connection.readyState === 0) {// not connected
            mongoose.connect(config.db, { useMongoClient: true }, function (err) {
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
        mongoose.disconnect();
        return done();
    });

    return mongoose;
})();
