var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Permission Model
 * ==================
 */

var Permission = new keystone.List('Permission', {
  noedit: true,
  nocreate: true,
  nodelete: true
});

Permission.add({
	name: { type: Types.Text, unique: true, required: true, initial: true, index: true },
});

Permission.relationship({ ref: 'Role', path: 'roles', refPath: 'permissions' });

Permission.register();
