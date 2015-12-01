let mapItems = (bracnhes, entities) => {
    let branchRegex = /feature\/(?:us|bug)(\d+)\w*/ig;
    let entityMap = _.reduce(entities, (memo, entity)=> {
        memo[entity.id] = entity;
        return memo;
    }, {});

    return _.map(bracnhes, branch => {
        let [,id] = branchRegex.exec(branch.name) || [];
        return {branch, task: entityMap[id]};
    });
};


Meteor.startup(()=> {
    var config = JSON.parse(Assets.getText("config.json"));

    var pmTool = new PMTool(config.pmTool.url);
    var codeTool = new CodeTool(config.codeTool.url);

    var entities = pmTool.getEntities();
    var branches = codeTool.getBranches();

    var items = mapItems(branches, entities);

    Items.remove({});
    items.forEach(i=>Items.insert(i));

    console.log(Items.find({}).fetch());
});
