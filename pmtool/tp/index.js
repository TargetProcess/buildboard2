var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var json = require('koa-json');
var app = koa();

app.use(json());
app.use(logger());

// route middleware

app.use(route.get('/', capabilities));
//app.use(route.get('/post/new', add));
//app.use(route.get('/post/:id', show));
//app.use(route.post('/post', create));

app.listen(3333);


function *capabilities(){
    this.body = yield {test:1};
}