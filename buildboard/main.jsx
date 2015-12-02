account = "buildboard";

Items = new Mongo.Collection(`${account}-items`);


let mapItems = (bracnhes, tasks, builds) => {
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

if (Meteor.isServer) {
    var accountConfig = JSON.parse(Assets.getText("config.json"));
}

Router.route('/:account/refresh', function () {
    var config = accountConfig.accounts[this.params.account];
    if (config) {
        var pmTool = new PMTool(this.params.account, config.pmTool);
        var codeTool = new CodeTool(this.params.account, config.codeTool);
        var buildTool = new BuildTool(this.params.account, config.buildTool);

        var tasks = pmTool.getTasks();
        var branches = codeTool.getBranches();
        var builds = buildTool.getBuilds();
        var items = mapItems(branches, tasks, builds);

        Items.remove({});
        items.forEach(i=>Items.insert(i));

        this.response.end(JSON.stringify(items));
    }
    else {
        this.response.statusCode = 404;
        this.response.end(JSON.stringify({status: "404", message: `account "${this.params.account}" not found.`}));
    }
}, {where: 'server'});

Router.route('/', function () {
    Template.index.onRendered(function () {
        ReactDOM.render(<App />, document.getElementById("render-target"));
    });
    this.render('index');

});