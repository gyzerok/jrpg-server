'use strict';

module.exports = {
    login: function (req, res) {
        var app = require('../app').app;
        var jwt = require('jsonwebtoken');
        var User = require('../models/User');

        User.findOne({username: req.body.username, password: req.body.password}, function (err, user) {
            if (err) return res.send(500);
            if (!user) return res.send(404);

            var token = jwt.sign({userId: user.id}, app.get('secret'), {expiresInMinutes: 60 * 5});

            res.json({token: token});
        });
    }
};