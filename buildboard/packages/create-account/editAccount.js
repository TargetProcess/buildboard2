var tools = new ReactiveVar([]);
Template.editAccount.helpers({
    tools() {
        return tools.get();
    }
});

Meteor.call('initTools', function (e, ts) {
    tools.set(ts.map((item) => {
        item.reactFields = new ReactiveVar([]);
        return item;
    }));
});
Template.editAccount.events({
    'submit form'(e, t) {
        e.preventDefault();
        var name = t.find('#account-name').value.trim();
        debugger
        /*Meteor.call('createAccount', name, function (err, result) {
         if (err) {
         alert(JSON.stringify(err))
         } else {
         Router.go('/' + result.id + '/edit');
         }
         })*/
    }
});