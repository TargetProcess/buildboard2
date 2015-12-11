const _ = require('lodash');

var validators = {
    'string': _.isString,
    'list': _.isArray,
    'multiple selection': (value, config)=> {
        if (!_.isArray(value)) {
            return false;
        }
        var rest = _.without(value, config.values);
        if (rest.length > 0) {
            return `Unknown values: ${rest.join(',')}`;
        }
        return true;
    },
    'uri': value=>_.isString(value) && (value.indexOf('http://') == 0 || value.indexOf('https://') == 0)
};

module.exports = {
    validators,
    validateSettings (settingsInfo, settings) {
        if (!_.isArray(settingsInfo)) {
            settingsInfo = _.map(settingsInfo, (v, k)=> {
                v.id = k;
                return v;
            });
        }

        var error = _(settingsInfo)
            .filter(config=>!config.optinal)
            .map(config=> {
                var id = config.id;
                var value = settings[id];
                if (!value) {
                    return `'${id} is required'`;
                }
                var validator = validators[config.type];
                if (!validator) {
                    return `Unknown type ${config.type} for ${id}`
                }
                var validationResult = validator(value, config);
                if (validationResult === false) {
                    return `'${id}' has invalid type, should be ${config.type}`;
                }
                else if (_.isString(validationResult)) {
                    return validationResult;
                }

            })
            .compact()
            .value();
        if (error.length == 0)
            return {accountConfig: settings};
        else
            return {error};
    }
};