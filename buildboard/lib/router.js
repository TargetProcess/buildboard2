Router.onBeforeAction(function () {
    if (!Meteor.user() && !Meteor.loggingIn()) {
        this.redirect('/login');
    } else {
        this.next();
    }
}, {
    except: ['login', 'register']
});

Router.route('/register', function () {
    if (Meteor.user()) {
        this.redirect('/');
    }
    this.layout('login');
    this.render('registerForm');
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
        var config = BuildBoardAccounts.findOne({id: {$eq: account}});
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

Router.route('/', {
    loadingTemplate: 'loading',
    waitOn() {
        return Meteor.subscribe('accounts');
    },
    action() {
        if (BuildBoardAccounts.find().count()) {
            Router.go('/' + BuildBoardAccounts.findOne({}).id);
        } else {
            Router.go('/createAccount');
        }
    }
});
Router.route('/createAccount', {
    loadingTemplate: 'loading',
    action() {
        this.render('createAccount');
    }
});

Router.route('/:account',
    {
        action() {
            var handle = Meteor.subscribeWithPagination('items', this.params.account, 20);
            this.render('itemList', {
                data: ()=> ({
                    account: this.params.account,
                    handle: handle
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


