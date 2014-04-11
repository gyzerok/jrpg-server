'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    username: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        required: true,
        default: 400
    },
    regDate: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = userSchema;