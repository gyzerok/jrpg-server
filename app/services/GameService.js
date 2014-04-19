'use strict';

var MatchmakerService = require('./MatchmakerService');
var MatchService = require('./MatchService');

var GameService = {
    init: function (app) {
        MatchmakerService.init(app);
        MatchService.init();
    },

    start: function () {
        MatchmakerService.start();
        MatchService.start();
    },

    stop: function () {
        MatchmakerService.stop();
        MatchService.stop();
    },

    addUser: function (socket) {
        var User = require('../models/User');
        User.findById(socket.userId, function (err, user) {
            MatchmakerService.queueUser(user);
        });
    },

    removeUser: function (socket) {
        var User = require('../models/User');
        User.findById(socket.userId, function (err, user) {
            MatchmakerService.dequeueUser(user);
        });
    }
};

module.exports = GameService;