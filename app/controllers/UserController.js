'use strict';

var UserController = {
    vent: null,

    init: function () {
        UserController.vent = require('../vent');

        return UserController;
    },

    findGame: function (socket, data) {
        var User = require('../models/User');

        User.findById(socket.userId, function (err, user) {
            // TODO: Добавить проверку ошибок
            UserController.vent.emit('new-user', user);
        });
    },

    cancelFindGame: function () {
    }
};

module.exports = UserController;