var _ = require('lodash');
var resmsg = require('../config/resmsg');
/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
  res.locals.navLinks = [];
  res.locals.user = req.user;
  next();
};

/**
    Inits the error handler functions into `res`
*/
exports.initErrorHandlers = function (req, res, next) {

  res.err = function (code, title, lead, message) {
    res.status(code).render('error', {
      code: code,
      title: title,
      lead: lead,
      message: message
    });
  };

  /*
	  This middleware simplifies returning errors from the API.

	  Example usage patterns and expected responses:
		  apiError('database error', err) => 500 { err }
		  apiError(403, 'invalid csrf') => 403 { error: 'invalid csrf' }
		  apiError(403, 'validation errors', err) => 403 { error: 'validation errors', detail: err }
		  apiError(403, 'not allowed', 'You can not delete yourself') => 403 { error: 'not allowed', detail: 'You can not delete yourself' }
		  apiError(400, err) => 400 { err }
		  apiError(err) => 500 { err }
  */
  res.apiError = function (statusCode, error, detail) {
    // process arguments
    if (typeof statusCode !== 'number' && detail === undefined) {
      detail = error;
      error = statusCode;
      statusCode = 500;
    }
    // apply the status code
    if (statusCode) {
      res.status(statusCode);
    }
    // unpack { error, detail } objects passed as the error argument w/o detail argument
    if (!detail && typeof error === 'object'
      && error.toString() === '[object Object]'
      && error.error && error.detail) {
      detail = error.detail;
      error = error.error;
    }
    // turn Errors into useful output
    if (error instanceof Error) {
      error = error.name !== 'Error' ? error.name + ': ' + error.message : error.message;
    }
    if (detail instanceof Error) {
      detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
    }
    // send error as json
    var data = typeof error === 'string' || (error && detail)
      ? { error: error, detail: detail }
      : error;
    res.json(data);

    var assign = require('object-assign');

    return assign({
      statusCode: statusCode,
    }, data);
  };

  next();
};

exports.preAdmin = function (req, res, next) {
  // TODO
  // you can customize any admin APIs here

  next();
}

/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
  var flashMessages = {
    info: req.flash('info'),
    success: req.flash('success'),
    warning: req.flash('warning'),
    error: req.flash('error'),
  };
  res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
  next();
};

/**
  Prevents people from accessing protected pages when they're not signed in
*/
exports.requireUser = function (req, res, next) {
  //if (!req.user) {
  //  res.apiError(401, resmsg.error.UserRoleError);
  //} else {
  //  next();
  //}
  next();
};

exports.requireAdmin = function (req, res, next) {
  //if (!req.user || !req.user.isAdmin) {
  //  res.redirect('/admin/signin');
  //} else {
  //  next();
  //}
  next();
};
