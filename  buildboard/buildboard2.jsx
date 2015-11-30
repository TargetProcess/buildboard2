Items = new Mongo.Collection("items");


if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Meteor.startup(()=>{
      //noinspection TypeScriptUnresolvedVariable
      React.render(<App />, document.getElementById("render-target"));
  })
}

if (Meteor.isServer) {
  Meteor.startup(function() {
      if (Items.find().count() === 0) {
          Items.insert(
              {
                  task: {
                      id: 123,
                      type: 'us',
                      name: "Task #1"
                  },
                  branch: {
                      id: "review"

                  }

              });
          console.log('hello');
      }
  });
}
