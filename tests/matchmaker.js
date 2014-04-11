'use strict';

var app = require('../app/app').app;
var server = require('../app/app').server;
var async = require('async');
var io = require('socket.io-client');
var expect = require('chai').expect;

var socketURL = 'http://0.0.0.0:' + app.get('port');
var options = {'force new connection': true};

var user1 = {username: 'user1', password: '123'};
var user2 = {username: 'user2', password: '456'};

var client1, client2;
var token1, token2;

describe("Server", function () {
    before(function (done) {
        server.listen(app.get('port'), function () {
            var User = require('../app/models/User');
            async.series([
                function (callback) {
                    User.collection.remove(callback);
                },
                function (callback) {
                    User.create(user1, callback);
                },
                function (callback) {
                    User.create(user2, callback);
                }
            ],
            function (err, results) {
                expect(err).to.be.undefined;
                done();
            });
        });
    });

    it('should login two clients', function (done) {
        var client = require('supertest')(app);
        client.post('/login')
              .send(user1)
              .expect(200)
              .end(function (err, res) {
                  token1 = res.body.token;
                  onComplete();
              });

        client.post('/login')
              .send(user2)
              .expect(200)
              .end(function (err, res) {
                  token2 = res.body.token;
                  onComplete();
              });

        var calls = 0;
        function onComplete() {
            calls += 1;

            if (calls == 2) {
                expect(token1).not.to.be.undefined;
                expect(token2).not.to.be.undefined;
                done();
            }
        }
    });

    it('should create a new game with these clients', function (done) {
        this.timeout(1000 * 60);

        client1 = io.connect(socketURL, {
            'force new connection': true,
            query: 'token=' + token1
        });

        client2 = io.connect(socketURL, {
            'force new connection': true,
            query: 'token=' + token2
        });

        client1.emit('find-game');
        client2.emit('find-game');

        client1.on('new-game', function (data) {
            expect(data.enemy).to.be.equal(user2.username);
            onComplete();
        });

        client2.on('new-game', function (data) {
            expect(data.enemy).to.be.equal(user1.username);
            onComplete();
        });

        var calls = 0;
        function onComplete() {
            calls += 1;

            if (calls == 2) done();
        }
    });
});

