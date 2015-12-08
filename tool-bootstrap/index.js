var Koa = require('koa');
var app = new Koa();
var url = require('url');

module.exports = {
    bootstrap({ port, mongo }, securedRouter, capabilities)
    {
        // body parser
        const bodyParser = require('koa-bodyparser');
        app.use(bodyParser());

        var auth = require('./auth');
        auth(mongo.url);

        const passport = require('koa-passport');
        app.use(passport.initialize());

        var logger = require('koa-logger');
        var json = require('koa-json');

        app.use(json());
        app.use(logger());

        var Router = require('koa-router');

        var unsecuredRouter = new Router();
        unsecuredRouter.get('/', function () {
            this.body = capabilities;
        });
        app
            .use(unsecuredRouter.routes());

        app.use(function*(next) {

            var ctx = this;
            yield passport.authenticate("authtoken",
                {session: true},
                function*(err, user) {
                    if (err) throw err;
                    if (user === false) {
                        ctx.status = 401;
                        ctx.body = {success: false}
                    } else {
                        yield ctx.login(user);
                        yield next;

                    }
                }).call(this, next);
        });

        app.use(function*(next) {
            if (this.isAuthenticated()) {
                yield next
            } else {
                this.redirect('/')
            }
        });

        var router = new Router();
        securedRouter({
            router
        });

        app
            .use(router.routes())
            .use(router.allowedMethods());

        app.listen(port);

    },
    getUrl(ctx){
        var request = ctx.request;
        return url.parse(request.protocol + '://' + request.host + request.originalUrl, true);
    }
};