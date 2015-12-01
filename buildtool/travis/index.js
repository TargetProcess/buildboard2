'use strict';

var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var json = require('koa-json');
var Travis = require('travis-ci');
var genify = require('thunkify-wrap').genify;
var _ = require('lodash');

var app = koa();
var travis = new Travis({
    version: '2.0.0'
});

app.use(json());
app.use(logger());

// route middleware

app.use(route.get('/', capabilities));
app.use(route.get('/builds', builds));

app.listen(3335);


var getBuilds = genify(travis.repos('TargetProcess', 'buildboard2').builds.get);

function *builds() {

    var {builds, commits} = yield getBuilds();

    let commitMap = _.indexBy(commits, 'id');

    this.body = _.map(builds, b=> {
        var commit = commitMap[b.commit_id];
        return {
            buildId: b.id,
            started: b.started_at,
            finished: b.finished_atm,
            duration: b.duration,
            sha: commit.sha,
            pullRequest: commit.pull_request_number,
            branch: commit.branch,
            status: b.state
        };
    });
}

function *capabilities() {
    this.body = yield {entities: []};
}