'use strict';

var matchService = {
    vent: require('../vent'),

    init: function () {},

    start: function () {
        matchService.vent.on('create-new-match', matchService.createMatch);
    },

    stop: function () {
        matchService.vent.removeListener('create-new-match');
    },

    createMatch: function (users) {
        var app = require('../app').app;

        app.io.get(users[0].id).emit('new-game', {enemy: users[1].username});
        app.io.get(users[1].id).emit('new-game', {enemy: users[0].username});
    }
};

module.exports = matchService;