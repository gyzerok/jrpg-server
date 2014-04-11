'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');
var userSchema = require('./schemas/UserSchema');

var userFields = ['username', 'password'];

userSchema.statics.create = function (data, callback) {
    var User = this;

    var user = new User(_.pick(data, userFields));
    user.save(callback);
};

module.exports = mongoose.model('User', userSchema);