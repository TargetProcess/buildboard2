module.exports = {
    bootstrap({port, accountConfig}, callback){
        var koa = require('koa');
        var logger = require('koa-logger');
        var router = require('koa-router')();

        var json = require('koa-json');

        var app = koa();

        app.use(json());
        app.use(logger());

        router = router.param('account', function *(id, next) {
            this.config = accountConfig[id];
            if (!this.config) {
                return this.status = 404;
            }
            yield next;
        });


        callback({
            router
        });

        app
            .use(router.routes())
            .use(router.allowedMethods());

        app.listen(port);
    }
};