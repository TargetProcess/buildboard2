Accounts = new Mongo.Collection('accounts');


account = "buildboard";
Items = new Mongo.Collection(`${account}-items`);


mapItems = (bracnhes, tasks, builds) => {
    let branchRegex = /feature\/(?:us|bug)(\d+)\w*/ig;
    let taskMap = _.indexBy(tasks, 'pmId');
    let buildMap = _.indexBy(builds, 'sha');

    return _.map(bracnhes, branch => {
        let [,id] = branchRegex.exec(branch.name) || [];
        var item = {branch, task: taskMap[id]};

        var branchBuild = buildMap[branch.sha];
        branch.builds = _.compact([branchBuild]);

        _.each(branch.pullRequests, pr=> {
            var prBuild = buildMap[pr.sha];
            pr.builds = _.compact([prBuild]);
        });
        return item;
    });
};

