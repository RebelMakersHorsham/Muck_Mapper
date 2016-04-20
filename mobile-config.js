// basic info
App.info({
  name: 'Muck Mapper',
  description: 'Map that Muck!',
  author: 'James Seden Smith',
  email: 'sedders123@gmail.com',
  website: 'http://sedders123.me'
});

// CORS for Meteor app
App.accessRule('meteor.local/*');
// allow tiles
App.accessRule('*.openstreetmap.org/*');
App.accessRule('*.tile.thunderforest.com/*');
