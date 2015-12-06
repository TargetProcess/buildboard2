'use strict';

var bootstrap = require('tool-bootstrap').bootstrap;
var url = require('url');

bootstrap(
    {
        mongo: {
            url: 'mongodb://127.0.0.1:3001/pmtool-tp'
        },
        port: 3333

    },
    ({router})=> {

        router.get('/tasks', tasks);
    });

var TP = require('./targetprocess.js');

function *tasks() {

    var request = this.request;
    var fullUrl = url.parse(request.protocol + '://' + request.host + request.originalUrl, true);

    var tp = new TP(this.passport.user.config);
    this.body = yield tp.getAssignables(this.request.query);
    if (this.body.next) {
        fullUrl.query.take = this.body.next.take;
        fullUrl.query.skip = this.body.next.skip;
        fullUrl.search = undefined;
        this.body.next = url.format(fullUrl);
    }

}