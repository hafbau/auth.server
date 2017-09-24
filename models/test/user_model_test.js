// describe, context, it etc are global initialized in test setup
const should = require('should');

module.exports = function(db) {
    // import our User mongoose model
    const User = require('../../models')(db).User;

    describe('Valid db object', function() {
        it('should be an object', function(done) {
            'object'.should.equal(typeof db)
            done();
        });
        it('should contain schema', function(done) {
            'undefined'.should.not.equal(typeof db.Schema)
            done();
        });
        it('should be connected', function(done) {
            'object'.should.equal(typeof db.connection)
            done();
        });
    });


    describe('Users model', function() {
        // Validation tests
        describe('validation', function() {
            it('should be invalid if email is empty', function(done) {
                const u = new User();

                u.validate(function(err) {
                    err.errors.email.should.exist;
                    done();
                });
            });

        });

        describe('#create', function() {

            context('given email and password', function() {
                it('should create a new User', function(done) {
                    const u = {
                        email: 'test@auth.auth',
                        password: 'password'
                    };
                    // Create a User object to pass to User.create()
                    User.create(u, function(err, createdUser) {
                        // Confirm that that an error does not exist
                        should.not.exist(err);
                        // verify that the returned user is what we expect
                        createdUser.email.should.equal('test@auth.auth');
                        createdUser.password.should.equal('password');
                        done();
                    });
                });
            });
        });
    });
}