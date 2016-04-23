Router.configure({
  layoutTemplate: 'mainLayout',
  //loadingTemplate: 'loading',
  //notFoundTemplate: '404'
});
Router.route('/', function () {
  document.title = 'Muck Mapper';
  this.render('mapLayout');
});

AccountsTemplates.configure({
    defaultLayout: 'userAccountLayout',
});
AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/login'
});
AccountsTemplates.configureRoute('signUp', {
    name: 'signup',
    path: '/register'
});
AccountsTemplates.configureRoute('verifyEmail', {
    name: 'verifyEmail',
    path: '/verify'
});



function setTitle (title) {
  document.title = title + " | Muck Mapper";
}
