Meteor.startup(function(){
  Logger = new Loggly({
        token: Meteor.settings.logglyToken,
        subdomain: "sedders123",
        auth: {
          username: Meteor.settings.logglyUser,
          password: Meteor.settings.logglyPassword
        },
        json: "true"
      });
});

// marker collection
var Markers = new Meteor.Collection('markers');
Meteor.publish("markers", function () {
  return Markers.find();
});

// Listen to incoming HTTP requests, can only be used on the server
WebApp.connectHandlers.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});

Meteor.methods({
   'clientLog': function(message) {
       Logger.log(message, ['meteorClient']);
   }
});
