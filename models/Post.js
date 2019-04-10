var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */
var Post = new keystone.List('Post', { track: { createdAt: true, createdBy: true } });

Post.add(
  {
    title: { type: Types.Text, initial: true, required: true, index: true },
    body: { type: Types.Html, wysiwyg: true, height: 150, initial: true }
  });

Post.defaultSort = '-createdAt';
Post.defaultColumns = 'title, body, createdBy, createdAt';
Post.register();
