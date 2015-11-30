'use strict';

var request = require('koa-request');

class Targetprocess {
    constructor(token, account) {
        this._token = token;
        this._root = `https://${account}.tpondemand.com/api/v2`;
    }

    _getOptions(resource, select, where) {
        return {url: `${this._root}/${resource}?select=${select}&where=${where}&take=1000&token=${this._token}`};
    }

    *_request(resource, select = "", where = "") {
        let options = this._getOptions(resource, select, where);
        let response = yield request(options); //Yay, HTTP requests with no callbacks!
        let body = JSON.parse(response.body);
        return body.items || body;
    }

    *getUsers() {
        return yield this._request('user', "{id,email}");
    }

    *getEntities() {
        return yield this._request('assignable', "{id,type:entityType.name,name,state:{entityState.id,entityState.name}}");

    }


}

module.exports = Targetprocess;