Template.toolSettings.events({
    'change .js-tool'(e, t) {
        t.data.reactFields.set([]);
        if(e.target.value) {
            Meteor.call('getToolsSettings',{type:t.data.type, id: e.target.value}, (err, res)=> {
                t.data.reactFields.set(res);
            });
        }
    }
});

Template.toolSettings.helpers({
    fields() {
        return this.reactFields.get();
    },
    jsClass(parent) {
        return 'js-' + parent.type;
    }
});
