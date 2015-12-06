Router.onBeforeAction(function () {
    if (!Meteor.user() && !Meteor.loggingIn()) {
        this.redirect('/login');
    } else {
        // required by Iron to process the route handler
        this.next();
    }
}, {
    except: ['login']
});


Router.route('/login', function () {
    if (Meteor.user()) {
        this.redirect('/');
    }
    this.layout('login');
    this.render('loginForm');
});

Router.configure({
    layoutTemplate: 'layout'
});
if (Meteor.isClient) {
    Meteor.subscribe("accounts");
}

Router.route('/:account/refresh',

    function () {
        var account = this.params.account;
        var config = Accounts.findOne({id: {$eq: account}});
        if (config) {
            var pmTool = new PMTool(config.token, config.tools.pm);
            var codeTool = new CodeTool(config.token, config.tools.code);
            var buildTool = new BuildTool(config.token, config.tools.build);

            var tasks = pmTool.getTasks();


            var branches = codeTool.getBranches();
            var builds = buildTool.getBuilds();
            var items = mapItems(branches, tasks, builds, account);

            Items.remove({account});
            items.forEach(i=>Items.insert(i));

            this.response.end(JSON.stringify(items));
        }
        else {
            this.response.statusCode = 404;
            this.response.end(JSON.stringify({status: "404", message: `account "${account}" not found.`}));
        }
    }, {where: 'server'});

Router.route('/', function () {
    this.render('accountList', {
        data: ()=> {
            return {accounts: Accounts.find({})}
        }
    });
});

Router.route('/:account',
    {
        loadingTemplate: 'loading',

        waitOn: function () {
            return Meteor.subscribe('items', this.params.account, this.params.query.skip, this.params.query.limit)
        },

        action: function () {
            this.render('itemList', {
                data: ()=> ({
                    account: this.params.account,
                    items: Items.find({})
                })
            });
        }
    }
);

Router.route('/:account/items/:id',
    {
        loadingTemplate: 'loading',
        waitOn: function () {
            return Meteor.subscribe('item', this.params.account, this.params.id);

        },
        action: function () {
            this.render('ItemView', {
                data: ()=> Items.findOne(this.params.id)
            });
        }
    });


