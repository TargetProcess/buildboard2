'use strict';

var bootstrap = require('tool-bootstrap').bootstrap;

bootstrap(
    {
        mongo: {
            host: 'localhost',
            port: 3001,
            db: 'pmtool-tp'
        },
        port: 3333

    },
    ({router})=> {
        router.get('/:account/tasks', tasks);
    });

var TP = require('./targetprocess.js');

function *tasks() {
    var tp = new TP(this.config);
    this.body = {tasks: yield tp.getAssignables()};
}