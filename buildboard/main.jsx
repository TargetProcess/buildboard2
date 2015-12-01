Items = new Mongo.Collection("items");
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

Router.route('/refresh', function () {
    var config = JSON.parse(Assets.getText("config.json"));

    var pmTool = new PMTool(config.pmTool.url);
    var codeTool = new CodeTool(config.codeTool.url);
    var buildTool = new BuildTool(config.buildTool.url);

    var tasks = pmTool.getTasks();
    var branches = codeTool.getBranches();
    var builds = buildTool.getBuilds();
    var items = mapItems(branches, tasks, builds);

    Items.remove({});
    items.forEach(i=>Items.insert(i));

    this.response.end(JSON.stringify(items));
}, {where: 'server'});

Router.route('/', function () {
    Template.index.onRendered(function () {
        React.render(<App />, document.getElementById("render-target"));
    });
    this.render('index');

});