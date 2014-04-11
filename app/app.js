'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

// Setting up configuration
require('./config')(app);
io.set('log level', app.get('log-level'));

var socketJwt = require('socketio-jwt');
io.set('authorization', socketJwt.authorize({
    secret: app.get('secret'),
    handshake: true
}));

app.io = io.sockets;
app.io.get = require('./sockByUserId')(app);
app.use(require('body-parser')());

// Setting up routes
require('./routes')(app);

// Starting services
var matchmakerService = require('./services/MatchmakerService');
matchmakerService.init(app);
matchmakerService.start();
var matchService = require('./services/MatchService');
matchService.init();
matchService.start();

// Connecting mongo
var mongoose = require('mongoose');
mongoose.connect(app.get('db-path'));

module.exports = {
    server: server,
    app: app
};