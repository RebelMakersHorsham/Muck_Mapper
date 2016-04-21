// Set up logger
logger ={};
logger.log = function(message){
  Meteor.call('clientLog', message);
};

// on startup run resizing event
Meteor.startup(function() {
  $(window).resize(function() {
    $('#map').css('height', window.innerHeight - 82 - 45);
  });
  $(window).resize(); // trigger resize event
  $(".button-collapse").sideNav({
    edge: 'right', // Choose the horizontal origin
    closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
  });
});

Template.body.helpers({
    photoUrl: function () {
      return Session.get("photo");
    },
    deleteHash: function () {
      return Session.get("deleteHash");
    },
    waitingForApiResponse: function () {
      return Session.get("waitingForApiResponse");
    }
  });

// create marker collection
var Markers = new Meteor.Collection('markers');

Meteor.subscribe('markers');

var pooIcon = L.icon({
    iconUrl: 'images/marker.png',
    iconAnchor:   [18, 18],
});

Template.map.rendered = function() {
  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';

  var map = L.map('map', {
    doubleClickZoom: false,
    attributionControl: false
  });
  map.locate({setView:true});

  L.tileLayer.provider('Thunderforest.Outdoors').addTo(map);

  map.on('dblclick', function(event) {
    Markers.insert({latlng: event.latlng});
    console.log(event.latlng);
  });

  var query = Markers.find();
  query.observe({
    added: function (document) {
      var marker = L.marker(document.latlng, {icon: pooIcon}).addTo(map)
        .on('click', function(event) {
          map.removeLayer(marker);
          Markers.remove({_id: document._id});
        });
    },
    removed: function (oldDocument) {
      layers = map._layers;
      var key, val;
      for (key in layers) {
        val = layers[key];
        if (val._latlng) {
          if (val._latlng.lat === oldDocument.latlng.lat && val._latlng.lng === oldDocument.latlng.lng) {
            map.removeLayer(val);
          }
        }
      }
    }
  });
};

Template.camera_button.events({
    'click .takePhoto': function(event, template) {
      Session.set('waitingForApiResponse', true);
      var cameraOptions = {
            width: 800,
            height: 600,
            quality: 100
      };
      MeteorCamera.getPicture(cameraOptions, function (error, data) {
        if (error) {
          throw error;
        } else {
          Imgur.upload({
            image: data,
            apiKey: Meteor.settings.public.imgurID
          }, function (error, data) {
            Session.set('waitingForApiResponse', false);
            if (error) {
              throw error;
            } else {
              Session.set("photo", data.link);
              logger.log({link: data.link});
              Session.set("deleteHash", data.deletehash);
            }
          });
        }
      });
      event.preventDefault();
    }
});
