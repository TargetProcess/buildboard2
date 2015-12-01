let mapItems = (bracnhes, entities) => {
    let branchRegex = /feature\/(?:us|bug)(\d+)\w*/ig;
    let taskMap = _.reduce(entities, (memo, task)=> {
        memo[task.id] = task;
        return memo;
    }, {});

    return _.map(bracnhes, branch => {
        let [,id] = branchRegex.exec(branch.name) || [];
        return {branch, task: taskMap[id]};
    });
};


Meteor.startup(()=> {
    var config = JSON.parse(Assets.getText("config.json"));

    var pmTool = new PMTool(config.pmTool.url);
    var codeTool = new CodeTool(config.codeTool.url);

    var tasks = pmTool.getTasks();
    var branches = codeTool.getBranches();

    var items = mapItems(branches, tasks);

    Items.remove({});
    items.forEach(i=>Items.insert(i));
});
