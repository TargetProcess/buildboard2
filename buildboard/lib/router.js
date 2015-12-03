Router.configure({
    layoutTemplate: 'layout'
});
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
    this.render('accountList', {
        data: ()=> {
            return {accounts: Accounts.find({})}
        }
    });
});
Router.route('/mock/', function () {
    //Items.remove({});
    //Accounts.remove({});
    Accounts.insert(sampleAccount);
    sampleData.forEach(i=>Items.insert(i));
    this.render('accountList', {
        data: ()=> {
            return {accounts: Accounts.find({})}
        }
    });
});
Router.route('/:account/', function () {
    this.render('itemList', {
        data: ()=> ({
            account: this.params.account,
            items: Items.find({})
        })
    });
});
Router.route('/:account/items/:id', function () {
    this.render('ItemView', {
        data: ()=> Items.findOne(this.params.id)
    });
});
