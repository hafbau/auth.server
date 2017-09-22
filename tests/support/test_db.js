const mongoose = require('mongoose');

const conn = mongoose.connect('mongodb://localhost:27017/authServerTest')
    .catch(err => console.log('failed to connect to test database', err));

mongoose.connection.on('open', () => {
    conn.connection.db.dropDatabase((err, result) => {
        if (err) throw new Error('Could not drop test database')

    })
});

module.exports = mogoose;