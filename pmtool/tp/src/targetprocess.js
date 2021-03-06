'use strict';

var request = require('koa-request');
var _ = require('lodash');
var url = require('url');


class Targetprocess {
    constructor(config) {
        this._config = config;

        var {token, url} = config;
        this._token = token;
        this._url = url;
    }

    stringifySelect(select) {
        var parts =
            _.map(select, (value, key)=>
                key + ':' + (_.isObject(value) ? this.stringifySelect(value) : value.toString())
            );
        return `{${parts.join(',')}}`;
    };


    _getOptions(resource, select, where, skip, take) {
        return {
            url: `${this._url}/api/v2/${resource}?select=${select || ""}&where=${where || "true"}&skip=${skip}&take=${take}&token=${this._token}`
        };
    }

    *_request(resource, select, where, skip, take) {
        if (!_.isString(select)) {
            select = this.stringifySelect(select);
        }

        let options = this._getOptions(resource, select, where, skip, take);
        let response = yield request(options);
        let body = JSON.parse(response.body);

        return {tasks: body.items || body, next: Targetprocess.buildNext(body.next)};
    }

    static buildNext(nextLink) {
        if (!nextLink) {
            return undefined;
        }
        var parsed = url.parse(nextLink, true);
        return {take: parsed.query.take, skip: parsed.query.skip};
    }

    static get filters() {
        return {
            'since_date': dateString=> {
                var date = `DateTime.Parse("${dateString}")`;
                return `createDate>=${date} or ModifyDate>=${date}`;
            },
            'since_id': id=>`id>=${id}`,
            'project': id=>_.isString(id) ? `project.name=="${id}"` : `project.id==${id}`,
            'entityType': id=>_.isString(id) ? `entityType.name=="${id}"` : `entityType.id==${id}`
        }
    }

    buildWhere(filter) {
        return _(Targetprocess.filters)
            .map((value, key)=> {
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

    *getAssignables(query) {

        query.project = this._config.projects;
        query.entityType = this._config.types;

        var where = this.buildWhere(query);

        let take = parseInt(query.per_page) || 100;
        let skip = take * (parseInt(query.page) - 1) || 0;


        return yield this._request('assignable', {
                'id': 'id',
                'type': 'entityType.name.ToLower()',
                'name': 'name',
                'state': {
                    'id': 'entityState.id',
                    'name': 'entityState.name'
                },
                users: 'Assignments.Select({user.id,user.email,name:user.fullName,role:role.name})',
                created: 'CreateDate.Value.ToString("o")',
                lastModified: 'ModifyDate.Value.ToString("o")'
            },
            where,
            skip, take);

    }

    *validate() {
        try {
            var loggedUserResponse = yield request({
                url: `${this._url}/api/v1/Users/loggedUser?token=${this._token}&format=json&include=[IsActive,DeleteDate,IsAdministrator]`
            });
        }
        catch (e) {
            return {error: [e]};
        }

        if (loggedUserResponse.statusCode != 200) {
            console.log(loggedUserResponse.body);
            return {error: {statusCode: loggedUserResponse.statusCode, statusMessage: loggedUserResponse.statusMessage}}
        }

        var result = [];


        var body = loggedUserResponse.body;
        if (_.isString(body)) {
            body = JSON.parse(body);
        }

        if (!body.IsActive) {
            result.push('User is no active');
        }
        if (body.DeleteDate != null) {
            result.push('User is deleted');
        }
        if (!body.IsAdministrator) {
            result.push('User is not an Administrator');
        }

        if (result.length > 0) {
            return {error: result};
        }
        else {
            return true;
        }
    }
}

module.exports = Targetprocess;