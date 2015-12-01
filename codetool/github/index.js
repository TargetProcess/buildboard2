'use strict';

var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var json = require('koa-json');
var Github = require('github');
var wrapper = require('co-github');
var _ = require('lodash');

var app = koa();

var github = wrapper(new Github({
    version: "3.0.0",
    debug: true,
    protocol: "https",
    host: "api.github.com",
    timeout: 5000
}));
github.authenticate({
    type: "oauth",
    token: process.env.TOKEN
});

app.use(json());
app.use(logger());

// route middleware

app.use(route.get('/', capabilities));
app.use(route.get('/branches', branches));

app.listen(3334);


function *branches() {
    //yield github.repos.pullRequests
    var repo = {user: 'TargetProcess', repo: "buildboard2"};

    var branches = yield github.repos.getBranches(repo);
    var pullRequests = yield github.pullRequests.getAll(repo);

    var pullRequestMap = _.groupBy(pullRequests, pr=>pr.head.ref);

    this.body = _.map(branches, b=> {
        let pullRequestsForBranch = pullRequestMap[b.name] || [];

        return {
            branchId: b.name,
            name: b.name,
            sha: b.commit.sha,
            pullRequests: _.map(pullRequestsForBranch, pr=> {
                return {
                    id: pr.number,
                    status: pr.state,
                    sha: pr.merge_commit_sha
                };
            })
        }
    });

}

function *capabilities() {
    this.body = yield {entities: []};
}