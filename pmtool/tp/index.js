'use strict';

var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var json = require('koa-json');
var app = koa();

var TP = require('./targetprocess.js');

var tp = new TP(process.env.TOKEN, "buildboard");


app.use(json());
app.use(logger());

// route middleware

app.use(route.get('/', capabilities));
app.use(route.get('/users', users));
app.use(route.get('/tasks', tasks));

app.listen(3333);


function *users() {
    this.body = {users: yield tp.getUsers()};
}

function *tasks() {
    this.body = {tasks: yield tp.getAssignables()};
}

function *capabilities() {
    this.body = yield {tasks: []};
}