Items = new Mongo.Collection("items");

if (Meteor.isClient) {

  Meteor.startup(()=>{
      //noinspection TypeScriptUnresolvedVariable
      React.render(<App />, document.getElementById("render-target"));
  })
}
