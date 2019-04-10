var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User', { track: { createdAt: true }, drilldown: 'role' });

User.add(
  {
    name: { type: Types.Name, required: true, initial: true },
    email: { type: Types.Email, unique: true, index: true, required: true, initial: true },
    password: { type: Types.Password, required: true, initial: true },
    role: { type: Types.Relationship, ref: 'Role', initial: true, required: true },
  });

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
  return true;
});

User.relationship({ ref: 'Post', path: 'posts', refPath: 'createdBy' });


User.schema.post('save', () => {
  // TODO: send Email
  //const sendEmail = require('../routes/emails').sendEmail;
  //sendEmail({ /* data */ });
});


User.defaultSort = '-createdAt';
User.defaultColumns = 'name, email, role';
User.register();
