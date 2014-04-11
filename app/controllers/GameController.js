'use strict';

var GameController = {
    vent: null,

    init: function () {
        GameController.vent = require('../vent');
        GameController.vent.on('create-new-game', GameController.create);

        return GameController;
    },

    create: function (users) {
        var app = require('../app').app;

        app.io.get(users[0].id).emit('new-game', {enemy: users[1].username});
        app.io.get(users[1].id).emit('new-game', {enemy: users[0].username});
    }
};

module.exports = GameController;