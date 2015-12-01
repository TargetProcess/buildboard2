'use strict';

var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var json = require('koa-json');
var Github = require('github');
var wrapper = require('co-github');
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
    this.body = {branches: yield github.repos.getBranches({user: 'TargetProcess', repo: "buildboard2"})};
}

function *capabilities() {
    this.body = yield {entities: []};
}