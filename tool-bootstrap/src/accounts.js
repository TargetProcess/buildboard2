var validateSettings = require('./validateSettings').validateSettings;
var _ = require('lodash');

module.exports = function (settings, mongoConfig) {


    function *checkSystemPassport(next) {
        if (this.passport.user.type == 'system') {
            yield next;
        }
        else {
            this.status = 403;
            this.body = {success: false}
        }
    }

    function *getAccount(next) {
        this.accountsCollection = this.mongo.db(mongoConfig.db)
            .collection('accounts');

        var accountToken = this.params.accountToken;

        this.account = yield this.accountsCollection
            .find({accountToken})
            .limit(1)
            .next();

        yield next;
    }


    function *get() {
        if (this.account) {
            this.body = _.omit(this.account, '_id');
        }
        else {
            this.body = {result: `Account '${this.params.accountToken}' not found`};
            this.status = 404;
        }
    }


    function *createOrUpdate() {
        console.log(this.request.body);
        var {error,accountConfig} = validateSettings(settings, this.request.body.config);
        if (error) {
            this.status = 400;
            this.body = error;
        }
        else {
            this.status = this.account ? 200 : 201;
            var account = _.assign(this.account || {}, {
                name: this.request.body.name,
                accountToken: this.params.accountToken,
                config: accountConfig
            });
            yield this.accountsCollection.updateOne({accountToken: this.params.accountToken},
                {$set: account},
                {upsert: !this.account});
            this.body = _.omit(account, '_id');
        }
    }

    function *deleteAccount() {
        if (this.account) {
            yield this.accountsCollection.deleteOne({_id: this.account._id});
            this.body = {result: 'deleted'};
            this.status = 200;
        }
        else {
            this.body = {result: `Account '${this.params.accountToken}' not found`};
            this.status = 404;
        }
    }


    return {
        setupRoutes(router){
            router.get('/account/:accountToken', checkSystemPassport, getAccount, get)
                .post('/account/:accountToken', checkSystemPassport, getAccount, createOrUpdate)
                .delete('/account/:accountToken', checkSystemPassport, getAccount, deleteAccount);
        }
    };


    /*   *createAccount(){
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

     }
     }*/
};