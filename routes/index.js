/* eslint-disable linebreak-style */

var keystone = require('keystone');
var middleware = require('./middleware');
var emails = require('./emails');
var params = require('./params');
var importRoutes = keystone.importer(__dirname);
var apiRoot = process.env.API_ROOT;

// Common Middleware
keystone.pre('routes', [middleware.initLocals, middleware.initErrorHandlers]);
keystone.pre('render', [middleware.flashMessages, keystone.security.csrf.middleware.init]);
keystone.pre('admin', middleware.preAdmin);

// Handle errors
keystone.set('500', function (err, req, res, next) {
  var message;
  if (err instanceof Error) {
    message = err.message;
    err = err.stack;
  } else {
    message = err;
  }
  res.err(500, 'Error', 'Sorry, the site has encountered an error.', message);
});

keystone.set('404', function (req, res, next) {
  res.err(404, 'Not Found', 'Sorry, the page you requested can\'t be found.');
});



// Import Route Controllers
var routes = {
  views: importRoutes('./views'),
  apis: importRoutes('./apis'),
};

// Setup Route Bindings
exports = module.exports = function (app) {

  app.use((req, res, next) => {
    // Latency
    const latency = process.env.LATENCY;
    if (!latency) next();
    else setTimeout(next, latency);
  });


  // Views
  app.get('/', routes.views.home);
  app.get('/signup', routes.views.signup);
  app.get('/chat', middleware.requireAdmin, routes.views.chat);

  // APIs
  var apiRoot = process.env.API_ROOT;
  app.post(apiRoot + '/auth/signup', keystone.security.csrf.middleware.validate, routes.apis.auth.signup);

  // init csrf token
  app.get(apiRoot + '/csrf', keystone.security.csrf.middleware.init, routes.apis.csrf);
};
