'use strict';

function comparer(a, b) {
    return a.user.rating - b.user.rating;
}

var MatchmakerService = {
    vent: require('../vent'),
    baseSearchRange: null,
    incrementSearchRange: null,
    matchTryInterval: null,

    tryInterval: null,
    queue: [],

    init: function (app) {
        MatchmakerService.baseSearchRange = app.get('baseSearchRange');
        MatchmakerService.incrementSearchRange = app.get('incrementSearchRange');
        MatchmakerService.matchTryInterval = app.get('matchTryInterval');
    },

    queueUser: function (user) {
        MatchmakerService.queue.push({user: user, range: MatchmakerService.baseSearchRange});
    },

    dequeueUser: function (user) {
        // TODO: Возможно тут нужно передавать userId, чтобы пользователь точно удалялся
        var index = MatchmakerService.queue.indexOf(user);
        MatchmakerService.queue.splice(index, 1);
    },

    start: function () {
        MatchmakerService.tryInterval = setInterval(MatchmakerService.tryMatch, MatchmakerService.matchTryInterval);
    },

    stop: function () {
        if (MatchmakerService.tryInterval) clearInterval(MatchmakerService.tryInterval);
    },

    tryMatch: function () {
        if (MatchmakerService.queue.length < 2) return;

        MatchmakerService.queue.sort(comparer);

        for (var i = 0; i < MatchmakerService.queue.length - 1; i++) {
            var checkingObj = MatchmakerService.queue[i];
            for (var j = i + 1; j < MatchmakerService.queue.length; j++) {
                var possiblePairObj = MatchmakerService.queue[j];

                // Нашлась ли пара?
                var acceptablePair = (checkingObj.user.rating + checkingObj.range) >= possiblePairObj.user.rating &&
                    (possiblePairObj.user.rating + possiblePairObj.range) >= checkingObj.user.rating;

                if (acceptablePair) {
                    MatchmakerService.vent.emit('create-new-match', [checkingObj.user, possiblePairObj.user]);
                }

                MatchmakerService.queue.splice(i, 1);
                MatchmakerService.queue.splice(j, 1);
            }
            // Не нашли пару. Увеличиваем границу
            if (MatchmakerService.queue.indexOf(checkingObj) != -1) {
                MatchmakerService.queue[i].range += MatchmakerService.incrementSearchRange;
            }
        }
    }
};

module.exports = MatchmakerService;