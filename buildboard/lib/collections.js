Accounts = new Mongo.Collection('accounts');
Items = new Mongo.Collection('items');

if (Meteor.isServer) {

    Meteor.publish("items", function (account, skip, limit) {
        return Items.find({account: account}, {skip: parseInt(skip) || 0, limit: parseInt(limit) || 10});
    });


    Meteor.publish('item', function (account, id) {

        return Items.find({account: account, _id: id});
    });

    Meteor.publish('accounts', function () {
        return Accounts.find();
    })
}

mapItems = (bracnhes, tasks, builds, account) => {
    let branchRegex = /feature\/(?:us|bug)(\d+)\w*/ig;
    let taskMap = _.indexBy(tasks, 'pmId');
    let buildMap = _.indexBy(builds, 'sha');

    return _.map(bracnhes, branch => {
        let [,id] = branchRegex.exec(branch.name) || [];
        var item = {account, branch, task: taskMap[id]};

        var branchBuild = buildMap[branch.sha];
        branch.builds = _.compact([branchBuild]);

        _.each(branch.pullRequests, pr=> {
            var prBuild = buildMap[pr.sha];
            pr.builds = _.compact([prBuild]);
        });
        return item;
    });
};

