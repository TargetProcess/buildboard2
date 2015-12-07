Template.accountList.helpers({
    accounts() {
        return Accounts.find({});
    }
});

Template.accountList.events({
    'click .js-create-account'() {
       Router.go('/createAccount');
    }
});
