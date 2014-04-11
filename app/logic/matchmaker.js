'use strict';

function comparer(a, b) {
    return a.user.rating - b.user.rating;
}

var matchmaker = {
    vent: null,
    baseSearchRange: null,
    incrementSearchRange: null,
    matchTryInterval: null,

    tryInterval: null,
    queue: [],

    init: function (app) {
        matchmaker.baseSearchRange = app.get('baseSearchRange');
        matchmaker.incrementSearchRange = app.get('incrementSearchRange');
        matchmaker.matchTryInterval = app.get('matchTryInterval');
        matchmaker.vent = require('../vent');

        matchmaker.vent.on('new-user', matchmaker.onNewUser);
    },

    onNewUser: function (user) {
        matchmaker.queue.push({user: user, range: matchmaker.baseSearchRange});
        matchmaker.tryMatch();
    },

    start: function () {
        matchmaker.tryInterval = setInterval(matchmaker.tryMatch, matchmaker.matchTryInterval);
    },

    stop: function () {
        if (matchmaker.tryInterval) clearInterval(matchmaker.tryInterval);
    },

    tryMatch: function () {
        if (matchmaker.queue.length < 2) return;

        matchmaker.queue.sort(comparer);

        for (var i = 0; i < matchmaker.queue.length - 1; i++) {
            var checkingObj = matchmaker.queue[i];
            for (var j = i + 1; j < matchmaker.queue.length; j++) {
                var possiblePairObj = matchmaker.queue[j];

                // Нашлась ли пара?
                var acceptablePair = (checkingObj.user.rating + checkingObj.range) >= possiblePairObj.user.rating &&
                    (possiblePairObj.user.rating + possiblePairObj.range) >= checkingObj.user.rating;

                if (acceptablePair) {
                    matchmaker.vent.emit('create-new-game', [checkingObj.user, possiblePairObj.user]);
                }

                matchmaker.queue.splice(i, 1);
                matchmaker.queue.splice(j, 1);
            }
            // Не нашли пару. Увеличиваем границу
            if (matchmaker.queue.indexOf(checkingObj) != -1) {
                matchmaker.queue[i].range += matchmaker.incrementSearchRange;
            }
        }
    }
};

module.exports = matchmaker;