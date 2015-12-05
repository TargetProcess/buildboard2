Template.loginForm.events({
   'click .js-github'(e) {
       e.preventDefault();
       Meteor.loginWithGithub({
        //   requestPermissions: ['user', 'email']
       },function(){

       });
   },
    'submit form'(e) {
        e.preventDefault();
        alert('not implemented');
    }
});