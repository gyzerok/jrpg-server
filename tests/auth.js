'use strict';

var app = require('../app/app').app;
var server = require('../app/app').server;
var io = require('socket.io-client');
var async = require('async');
var expect = require('chai').expect;

var socketURL = 'http://0.0.0.0:' + app.get('port');

var testUser = {username: 'test', password: 'test'};
var token = null;

describe("Server", function () {
    before(function (done) {
        server.listen(app.get('port'), function () {
            var User = require('../app/models/User');
            async.series([
                function (callback) {
                    User.collection.remove(callback);
                },
                function (callback) {
                    User.create(testUser, callback);
                }
            ],
            function (err, results) {
                expect(err).to.be.undefined;
                done();
            });
        });
    });

    it('must return token on login', function (done) {
        var client = require('supertest')(app);
        client.post('/login')
              .send({username: 'test', password: 'test'})
              .expect(200)
              .end(function (err, res) {
                    expect(res.body.token).not.to.be.undefined;
                    token = res.body.token;
                    done();
               });
    });

    it('must accept incoming connection with this token', function (done) {
        var opt = {
            'force new connection': true,
            query: 'token=' + token
        };
        var client = io.connect(socketURL, opt);

        client.on('connect', done);
    });
});
