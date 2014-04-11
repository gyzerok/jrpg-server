'use strict';

var UserController = {
    vent: require('../vent'),

    findGame: function (socket, data) {
        var User = require('../models/User');

        User.findById(socket.userId, function (err, user) {
            // TODO: Добавить проверку ошибок
            UserController.vent.emit('add-user-to-mm', user);
        });
    },

    cancelFindGame: function (socket, data) {
        var User = require('../models/User');

        User.findById(socket.userId, function (err, user) {
            // TODO: Добавить проверку ошибок
            UserController.vent.emit('remove-user-from-mm', user);
        });
    }
};

module.exports = UserController;