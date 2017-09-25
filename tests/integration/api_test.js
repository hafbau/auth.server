'use strict';
const { db, server } = require('../../index');
const testDB = require('../support/test_setup')(db);
const User = db.models['User'];
const request = require('supertest');

const should = require('should');

describe('User API:', function () {
    let user, token;

    describe('POST /register', function () {
        it('should respond with the saved user when sending a valid request', function (done) {
            const userTest = {
                email: "test@example.com",
                password: "test123"
            };
            request(server)
                .post('/register')
                .send(userTest)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err)
                        should.ifError(err);
                    else {
                        user = res.body.user;
                        token = res.body.token;
                        done();
                    }

                });
        });

        it('should not respond when sending an invalid request', function (done) {
            const userTest = {};
            request(server)
                .post('/register')
                .send(userTest)
                .expect(400)
                .end((err, res) => {
                    if (err)
                        should.ifError(err);
                    else
                        done();
                });
        });
    })

    describe('POST /login', function () {
        let token;
        it('should respond with a valid token when authenticating', function (done) {
            request(server)
                .post('/login')
                .send({
                    email: 'test@example.com',
                    password: 'test123'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err)
                        should.ifError(err);
                    else {
                        token = res.body.token;
                        done();
                    }

                });
        });

        it('should respond with a user profile when authenticated', function (done) {
            request(server)
                .get('/')
                .set('x-access-token', token)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err)
                        should.ifError(err);
                    else {
                        expect(res.body.user.email).toEqual(user.email);
                        done();
                    }
                });
        });

        it('should respond with a 401 when not authenticated', function (done) {
            request(server)
                .get('/')
                .expect(403)
                .end((err, res) => {
                    if (err)
                        should.ifError(err);
                    else
                        done();
                });
        });
    });
});
