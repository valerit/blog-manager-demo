var keystone = require('keystone');
var Types = keystone.Field.Types;
var AllPermissions = require('../seed/permission.json');
/**
 * Role Model
 * ==========
 */
var Role = new keystone.List('Role', {
  noedit: true,
  nocreate: true,
  nodelete: true
});

Role.add(
  {
    name: { type: Types.Text, unique: true, required: true, initial: true, index: true },
    permissions: { type: Types.Relationship, ref: 'Permission', many: true },
  });

Role.schema.virtual('canAccessKeystone').get(function () {
  return this.permissions.length === AllPermissions.length;
});

Role.relationship({ ref: 'User', path: 'users', refPath: 'role' });

Role.defaultSort = 'name';
Role.defaultColumns = 'name, permissions';
Role.register();
