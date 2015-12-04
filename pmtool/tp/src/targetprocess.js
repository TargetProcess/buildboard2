'use strict';

var request = require('koa-request');
var _ = require('lodash');
class Targetprocess {
    constructor({token, account}) {
        this._token = token;
        this._root = `https://${account}.tpondemand.com/api/v2`;
    }

    stringifySelect(select) {
        var parts =

            _.map(select, (value, key)=>
                key + ':' + (_.isObject(value) ? this.stringifySelect(value) : value.toString())
            );
        return `{${parts.join(',')}}`;
    };


    _getOptions(resource, select, where) {
        return {
            url: `${this._root}/${resource}?select=${select || ""}&where=${where || "true"}&take=1000&token=${this._token}`
        };
    }

    *_request(resource, select, where) {
        if (!_.isString(select)) {
            select = this.stringifySelect(select);
        }

        let options = this._getOptions(resource, select, where);
        let response = yield request(options); //Yay, HTTP requests with no callbacks!
        let body = JSON.parse(response.body);
        return body.items || body;
    }

    static get filters() {
        return {
            'since_date': dateString=> {
                var date = `DateTime.Parse("${dateString}")`;
                return `createDate>=${date} or ModifyDate>=${date}`;
            },
            'since_id': id=>`id>=${id}`,
            'project': id=>_.isString(id) ? `project.name=="${id}"` : `project.id==${id}`
        }
    }

    buildWhere(filter) {
        return _(Targetprocess.filters)
            .map((value, key)=> {
                // console.log(value, key)

                var filterValue = filter[key];
                if (filterValue) {
                    var filterValueArray = _.isArray(filterValue) ? filterValue : [filterValue];

                    var result = _.map(filterValueArray, value);
                    if (!(!result || result.length === 0)) {
                        if (result.length == 1) {
                            return result[0];
                        }
                        else {
                            return _.map(result, x=>`(${x})`).join(' or ');
                        }
                    }
                }
            })
            .compact()
            .map(x=>`(${x})`)
            .value()
            .join(' and ');
    }

    *getAssignables(filter) {

        var where = this.buildWhere(filter);


        return yield this._request('assignable', {
                'pmId': 'id',
                'type': 'entityType.name',
                'name': 'name',
                'state': {
                    'id': 'entityState.id',
                    'name': 'entityState.name'
                },
                created: 'CreateDate.Value.ToString("o")',
                lastModified: 'ModifyDate.Value.ToString("o")'
            },
            where);

    }
}

module.exports = Targetprocess;