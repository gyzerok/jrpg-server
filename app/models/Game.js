'use strict';

var _ = require('underscore');

var Game = function (user1, user2) {
    this.users.push(user1);
    this.users.push(user2);
};

Game.prototype = {
    vent: require('./vent'),
    users: [],
    actions: [],
    attUser: null,
    defUser: null,

    onAction: function (userId, action) {
        var actingUser = _.filter(this.users, function (user) {
            return user.id == userId;
        })[0];
        if (!actingUser) return;

        this.actions.push(action);
    }
};

module.exports = Game;