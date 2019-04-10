// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystone.com/guide/config for available options
// and documentation.

keystone.init({
  'name': 'BlogManager',
  'brand': 'BlogManager',

  //'signin logo': ['/images/logo.png'],
  'admin path': 'admin',
  'logger': ':method :url :status :response-time ms - :res[content-length]',

  'sass': 'public',
  'static': 'public',
  'favicon': 'public/favicon.ico',
  'views': 'templates/views',
  'view engine': 'pug',

  'emails': 'templates/emails',

  'auto update': true,
  'session': true,
  // 'session options': {
  // 	cookie: { secure: false, maxAge: 31104000  }
  //   },
  'auth': true,
  'user model': 'User',
  'cookie secret': process.env.COOKIE_SECRET,
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
  _: require('lodash'),
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
  users: 'users',
  rolesAndPermissions: ['roles', 'permissions'],
  posts: 'posts',
  goToAdminChat: [{
    key: 'chat',
    path: '/chat',
    external: true,
  }],
});

keystone.start();
