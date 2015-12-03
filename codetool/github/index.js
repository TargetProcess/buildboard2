'use strict';

var Github = require('github');
var wrapper = require('co-github');
var _ = require('lodash');

var bootstrap = require('tool-bootstrap').bootstrap;

bootstrap(
    {
        mongo: {
            url: 'mongodb://127.0.0.1:3001/codetool-github'
        },
        port: 3334

    },

    ({router})=> {
        router.get('/branches', branches);
    });


function *branches() {

    var github = wrapper(new Github({
        version: "3.0.0",
        debug: true,
        protocol: "https",
        host: "api.github.com",
        timeout: 5000
    }));

    var config = this.passport.user.config;
    github.authenticate(config.authentication);

    var branches = yield github.repos.getBranches(config.repo);
    var pullRequests = yield github.pullRequests.getAll(config.repo);

    var pullRequestMap = _.groupBy(pullRequests, pr=>pr.head.ref);

    this.body = {
        branches: _.map(branches, b=> {
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
        })
    };

}