console.log(process.env.SECRET_KEY);

var Koa = require('koa');
var app = new Koa();
var url = require('url');
var _ = require('lodash');
var Mongo = require('koa-mongo');


module.exports = {
    bootstrap({ port, mongo, settings, methods }, securedRouter)
    {
        // body parser
        const bodyParser = require('koa-bodyparser');
        app.use(bodyParser());

        var auth = require('./auth');

        const mongoUrl = mongo.url || `mongodb://${mongo.host || '127.0.0.1'}:${mongo.port || 27017}/${mongo.db}`;
        auth(mongoUrl);

        app.use(Mongo({url: mongoUrl}));

        const passport = require('koa-passport');
        app.use(passport.initialize());

        var logger = require('koa-logger');
        var json = require('koa-json');

        app.use(json());
        app.use(logger());


        var Router = require('koa-router');


        var unsecuredRouter = new Router();

        unsecuredRouter.get('/', function () {
            this.body = {
                settings,
                methods
            }
        });


        app.use(unsecuredRouter.routes());

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

        var validateSettings = function (settingsInfo, settings) {
            return {error: null, accountConfig: settings};
        };

        var router = new Router();


        router.post('/account', function *() {
            if (this.passport.user.type == 'system') {

                var {error,accountConfig} = validateSettings(settings, this.request.body.config);

                if (error) {
                    this.status = 404;
                    this.body = error;
                }
                else {
                    var account = {
                        name: this.request.body.name,
                        token: this.request.body.accountToken,
                        config: accountConfig
                    };
                    this.mongo.db(mongo.db)
                        .collection('accounts')
                        .insertOne(
                            account
                        );
                    this.body = account;
                }
            } else {
                this.status = 401;
                this.body = {success: false}
            }
        });


        if (securedRouter) {
            securedRouter({
                router
            });
        }

        _.each(methods, (method, methodName)=> {
            _.each(method, (config, action)=> {
                router[action](methodName, config.action)
            });
        });

        app
            .use(router.routes())
            .use(router.allowedMethods());

        app.listen(port);

    },
    getUrl(ctx)
    {
        var request = ctx.request;
        return url.parse(request.protocol + '://' + request.host + request.originalUrl, true);
    }
};

