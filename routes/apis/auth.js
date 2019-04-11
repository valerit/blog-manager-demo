var keystone = require('keystone');
var middleware = require('../middleware');
var resmsg = require('../../config/resmsg');

const manualSignin = function (req, res, user) {
  keystone.callHook(user, 'pre:signin', req, function (err) {
    if (err) {
      return res.error(500, 'Error', resmsg.error.SavingData, 'pre:signin error');
    }
    keystone.session.signinWithUser(user, req, res, function () {
      keystone.callHook(user, 'post:signin', req, function (err) {
        if (err) {
          return res.apiError(500, resmsg.error.SavingData, 'post:signin error');
        }
        return res.redirect('/admin');
      });
    });
  });
};

exports.signup = function (req, res, next) {
  var name = req.body.name.trim();
  if (name.length == 0) return res.err(500, 'Error', resmsg.error.InvalidDetails, 'Invalid field(s)');
  var firstName = name.split(' ').slice(0, -1).join(' ');
  var lastName = name.split(' ').slice(-1).join(' ');
  req.body.name = { first: firstName, last: lastName };

  const User = keystone.list('User');
  const Role = keystone.list('Role');
  Role.model.findOne({ name: "User" }).exec((err, role) => {
    if (err) return res.err(500, 'Error', resmsg.error.FindingData, 'Cannot find User role');
    req.body.role = role;
    const newUser = new User.model(req.body);
    newUser.save((err) => {
      if (err) return res.err(500, 'Error', resmsg.error.SavingData, 'Cannot save User');
      return manualSignin(req, res, newUser);
    });
  });

};
