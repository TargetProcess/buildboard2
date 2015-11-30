var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var json = require('koa-json');
var request = require('koa-request');
var app = koa();

app.use(json());
app.use(logger());

// route middleware

//app.use(route.get('/', capabilities));
app.use(route.get('/entities', capabilities));
app.use(route.get('/users', users));
app.use(route.get('/entities/:id', capabilities));
app.use(route.post('/entities/:id', capabilities));
//app.use(route.get('/post/new', add));
//app.use(route.get('/post/:id', show));
//app.use(route.post('/post', create));

app.listen(3333);

function *users() {
    var options = {
        url: 'https://buildboard.tpondemand.com/api/v2/user?select={id,email}&token=' + process.env.TOKEN
    };
    console.log(options);
    var response = yield request(options); //Yay, HTTP requests with no callbacks!
    var info = JSON.parse(response.body);

    this.body = {users: info};
}
function *capabilities(){
    this.body = yield {entities: []};
}