Meteor.methods({
    getToolsSettings(t) {
        var settings = Meteor.settings;
        var tools = Meteor.settings.tools;
        var tool = _.chain(tools)
            .find(tool => tool.type === t.type)
            .pick('tools').value();
        tool = _.find(tool.tools, tool=>tool.id === t.id);
        var url = settings.url + ':' + tool.port;
        return _.map(HTTP.get(url).data.settings, (obj, key)=> {
            obj.name = key;
            return obj;
        });
    }
});