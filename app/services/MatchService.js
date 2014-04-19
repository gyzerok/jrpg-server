'use strict';

var MatchService = {
    vent: require('../vent'),

    init: function () {},

    start: function () {
        MatchService.vent.on('create-new-match', MatchService.createMatch);
    },

    stop: function () {
        MatchService.vent.removeListener('create-new-match');
    },

    createMatch: function (users) {
        var app = require('../app').app;

        app.io.get(users[0].id).emit('new-game', {enemy: users[1].username});
        app.io.get(users[1].id).emit('new-game', {enemy: users[0].username});
    }
};

module.exports = MatchService;