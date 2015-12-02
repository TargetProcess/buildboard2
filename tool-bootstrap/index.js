var mongoDb = require('koa-mongo');
var koa = require('koa');
var logger = require('koa-logger');
var router = require('koa-router')();
var json = require('koa-json');



module.exports = {
    bootstrap({ port, mongo }, callback)
    {
        var app = koa();
        app.use(json());
        app.use(logger());
        app.use(mongoDb(mongo));

        router.param('account', function *(id, next) {

            var db = this.mongo.db(mongo.db);

            var account = yield db
                .collection('accounts')
                .find({id: {$eq: id}})
                .limit(1)
                .next();

            if (!account) {
                return this.status = 404;
            }
            else {
                this.config = account;
            }
            yield next;
        });

        callback({
            router,
            mongo
        });

        app
            .use(router.routes())
            .use(router.allowedMethods());

        app.listen(port);

    }
};