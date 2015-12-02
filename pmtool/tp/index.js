'use strict';

var bootstrap = require('tool-bootstrap').bootstrap;

var accountConfig = require('./config.json');


bootstrap({
    accountConfig,
    port: 3333
}, ({router})=> {
    router.get('/:account/tasks', tasks);
});


var TP = require('./targetprocess.js');

function *tasks() {
    var tp = new TP(this.config);
    this.body = {tasks: yield tp.getAssignables()};
}