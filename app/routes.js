'use strict';

var AuthController = require('./controllers/AuthController');
var UserController = require('./controllers/UserController');

module.exports = function (app) {

    app.post('/login', AuthController.login);

    app.io.on('connection', function (socket) {
        socket.userId = socket.handshake.decoded_token.userId;
        socket.on('find-game', function (data) {
            UserController.findGame(socket, data);
        });
        socket.on('cancel-find-game', function (data) {
            UserController.cancelFindGame(socket, data);
        });
    });
};