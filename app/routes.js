'use strict';

var AuthController = require('./controllers/AuthController');

module.exports = function (app, GameService) {

    app.post('/login', AuthController.login);

    app.io.on('connection', function (socket) {
        socket.userId = socket.handshake.decoded_token.userId;
        socket.on('find-game', function (data) {
            GameService.addUser(socket);
        });
        socket.on('cancel-find-game', function (data) {
            GameService.removeUser(socket);
        });
    });
};