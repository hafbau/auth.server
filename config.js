module.exports = {

    'tokenSecret': 'ilovemesecreet',
    'db': {
        'development': 'mongodb://localhost:27017/authServer',
        'production': 'mongodb://0.0.0.0:27017/authServer',
        'test': 'mongodb://localhost:27017/authServerTest'
    }[process.env.NODE_ENV || 'development']

};
