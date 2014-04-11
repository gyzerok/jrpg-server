'use strict';

module.exports = function (app) {
    app.set('log-level', 0);
    app.set('port', 3333);
    app.set('secret', 'KJFdfsfuir&dfasf7');
    app.set('db-path', 'mongodb://localhost/jrpg');

    app.set('baseSearchRange', 100);
    app.set('incrementSearchRange', 10);
    app.set('matchTryInterval', 5000);

    var env = process.env.NODE_ENV || 'development';
    if ('test' == env) {
        app.set('db-path', 'mongodb://localhost/jrpg-test');
    }
};