'use strict';

var bootstrap = require('tool-bootstrap').bootstrap;
var Travis = require('travis-ci');

var genify = require('thunkify-wrap').genify;
var _ = require('lodash');

var travis = new Travis({
    version: '2.0.0'
});


var accountConfig = require('./config.json');

bootstrap({accountConfig, port: 3335}, ({router})=> {
    router
        .get('/:account/builds', builds);

});

var getBuilds = genify(({user,repo}, callback)=>travis.repos(user, repo).builds.get(callback));

function *builds() {
    var {builds, commits} = yield getBuilds(this.config);
    let commitMap = _.indexBy(commits, 'id');
    this.body = {
        builds: _.map(builds, b=> {
            var commit = commitMap[b.commit_id];
            return {
                buildId: b.id,
                started: b.started_at,
                finished: b.finished_at,
                duration: b.duration,
                sha: commit.sha,
                pullRequest: commit.pull_request_number,
                branch: commit.branch,
                status: b.state
            };
        })
    };

}