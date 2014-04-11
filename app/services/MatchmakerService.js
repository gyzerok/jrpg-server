'use strict';

function comparer(a, b) {
    return a.user.rating - b.user.rating;
}

var matchmakerService = {
    vent: require('../vent'),
    baseSearchRange: null,
    incrementSearchRange: null,
    matchTryInterval: null,

    tryInterval: null,
    queue: [],

    init: function (app) {
        matchmakerService.baseSearchRange = app.get('baseSearchRange');
        matchmakerService.incrementSearchRange = app.get('incrementSearchRange');
        matchmakerService.matchTryInterval = app.get('matchTryInterval');
    },

    onAddUser: function (user) {
        matchmakerService.queue.push({user: user, range: matchmakerService.baseSearchRange});
        matchmakerService.tryMatch();
    },

    onRemoveUser: function (user) {
        var index = matchmakerService.queue.indexOf(user);
        matchmakerService.queue.splice(index, 1);
    },

    start: function () {
        matchmakerService.vent.on('add-user-to-mm', matchmakerService.onAddUser);
        matchmakerService.vent.on('remove-user-from-mm', matchmakerService.onRemoveUser);
        
        matchmakerService.tryInterval = setInterval(matchmakerService.tryMatch, matchmakerService.matchTryInterval);
    },

    stop: function () {
        if (matchmakerService.tryInterval) clearInterval(matchmakerService.tryInterval);

        matchmakerService.removeListener('add-user-to-mm');
        matchmakerService.removeListener('remove-user-from-mm');
    },

    tryMatch: function () {
        if (matchmakerService.queue.length < 2) return;

        matchmakerService.queue.sort(comparer);

        for (var i = 0; i < matchmakerService.queue.length - 1; i++) {
            var checkingObj = matchmakerService.queue[i];
            for (var j = i + 1; j < matchmakerService.queue.length; j++) {
                var possiblePairObj = matchmakerService.queue[j];

                // Нашлась ли пара?
                var acceptablePair = (checkingObj.user.rating + checkingObj.range) >= possiblePairObj.user.rating &&
                    (possiblePairObj.user.rating + possiblePairObj.range) >= checkingObj.user.rating;

                if (acceptablePair) {
                    matchmakerService.vent.emit('create-new-match', [checkingObj.user, possiblePairObj.user]);
                }

                matchmakerService.queue.splice(i, 1);
                matchmakerService.queue.splice(j, 1);
            }
            // Не нашли пару. Увеличиваем границу
            if (matchmakerService.queue.indexOf(checkingObj) != -1) {
                matchmakerService.queue[i].range += matchmakerService.incrementSearchRange;
            }
        }
    }
};

module.exports = matchmakerService;