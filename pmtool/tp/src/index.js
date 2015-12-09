'use strict';

var tool = require('tool-bootstrap');
var url = require('url');

tool.bootstrap(
    {
        mongo: {
            port: process.env.MONGO_PORT || 3001,
            db: 'pmtool-tp'
        },
        port: process.env.TP_PORT || 3333

    },
    ({router})=> {
        router.get('/tasks', tasks);
    }, {
        branches: {
            get: ['take', 'skip']
        }
    });

var TP = require('./targetprocess.js');

function *tasks() {

    var fullUrl = tool.getUrl(this);

    var tp = new TP(this.passport.user.config);
    this.body = yield tp.getAssignables(this.request.query);
    if (this.body.next) {
        fullUrl.query.page = parseInt(fullUrl.query.page) + 1;
        fullUrl.search = undefined;
        this.body.next = url.format(fullUrl);
    }
}
