Meteor.startup(()=>{
    if (Meteor.isServer) {
        var accountConfig = JSON.parse(Assets.getText("config.json"));
        ServiceConfiguration.configurations.upsert(
            { service: "github" },
            {
                $set: accountConfig.github
            }
        );
    }

});

