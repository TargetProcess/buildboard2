'use strict';

var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var json = require('koa-json');
var app = koa();

var tp = new TP(process.env.TOKEN, "buildboard");


app.use(json());
app.use(logger());

// route middleware

app.use(route.get('/', capabilities));
//app.use(route.get('/entities', capabilities));
app.use(route.get('/users', users));
app.use(route.get('/entities', entities));
//app.use(route.post('/entities/:id', capabilities));
//app.use(route.get('/post/new', add));
//app.use(route.get('/post/:id', show));
//app.use(route.post('/post', create));

app.listen(3333);


function *users() {
    this.body = {users: yield tp.getUsers()};
}

function *entities() {
    this.body = {entities: yield tp.getEntities()};
}

function *capabilities() {
    this.body = yield {entities: []};
}