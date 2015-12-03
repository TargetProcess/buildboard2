'use strict';

var bootstrap = require('tool-bootstrap').bootstrap;

bootstrap(
    {
        mongo: {
            url: 'mongodb://127.0.0.1:3001/pmtool-tp'
        },
        port: 3333

    },
    ({router})=> {

        router.get('/tasks', tasks());
    });

var TP = require('./targetprocess.js');

function tasks() {
    return function *() {
        var tp = new TP(this.passport.user.config);
        this.body = {tasks: yield tp.getAssignables()};
    }
}