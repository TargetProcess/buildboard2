Items = new Mongo.Collection("items");
let mapItems = (bracnhes, entities) => {
    let branchRegex = /feature\/(?:us|bug)(\d+)\w*/ig;
    let taskMap = _.reduce(entities, (memo, task)=> {
        memo[task.pmId] = task;
        return memo;
    }, {});

    return _.map(bracnhes, branch => {
        let [,id] = branchRegex.exec(branch.name) || [];
        return {branch, task: taskMap[id]};
    });
};

Router.route('/refresh', function () {
    var config = JSON.parse(Assets.getText("config.json"));

    var pmTool = new PMTool(config.pmTool.url);
    var codeTool = new CodeTool(config.codeTool.url);

    var tasks = pmTool.getTasks();
    var branches = codeTool.getBranches();
    console.log(tasks, branches);
    var items = mapItems(branches, tasks);

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