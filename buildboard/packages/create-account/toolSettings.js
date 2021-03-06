Template.toolSettings.events({
    'change .js-tool'(e, t) {
        t.data.reactFields.set([]);
        if (e.target.value) {
            Meteor.call('getToolsSettings', {type: t.data.type, id: e.target.value}, (err, res)=> {
                t.data.reactFields.set(res);
            });
        }
    },
    'click .js-edit'(e, t) {
        var data = t.data;
        Meteor.call('getToolsSettings', {
            type: data.type,
            id: data.currentValue.toolId
        }, data.currentValue.accountToken, (err, res)=> {
            t.data.reactFields.set(res);
        });
    }
});

Template.toolSettings.helpers({
    fields() {
        return this.reactFields.get();
    },
    currentTool() {
        return this.tools.find(tool=>tool.id === this.currentValue.toolId).name;
    },
    isRequire() {
        return !this.optional;
    },
    jsClass(parent) {
        return 'js-' + parent.type;
    }
});
