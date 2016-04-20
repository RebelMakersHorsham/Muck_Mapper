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
    doubleClickZoom: false
  }).setView([54.1881, -2.109375], 6);

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

//Template.example.events({
//    'click .takePhoto': function(event, template) {
//        var cameraOptions = {
//            width: 800,
//            height: 600
//        };
//        MeteorCamera.getPicture(cameraOptions, function (error, data) {
//           if (!error) {
//               template.$('.photo').attr('src', data);
//           }
//        });
//        event.preventDefault();
//    }
//});
