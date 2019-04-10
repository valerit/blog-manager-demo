const keystone = require('keystone');

const DATA = {
  Permission: require('../seed/permission.json'),
  Role: require('../seed/role.json'),
  User: require('../seed/user.json'),
  Post: require('../seed/post.json')
};

async function create(keystone_list, data) {
  let List = keystone.list(keystone_list)
  let created_items = []
  for (let item of data[keystone_list]) {
    for (let key in item) {
      // use 'REF__' to define fields
      if (/^REF__/i.test(key)) {
        // remove 'REF__' and use as mongoose field name
        let keystone_field = key.replace(/^REF__/i, '')
        // allows for many: true
        if (Array.isArray(item[key])) {
          item[keystone_field] = []
          for (let many_item of item[key]) {
            let ref_item = await keystone.list(many_item.ref).model.findOne(await many_item.find)
            if (ref_item === null) throw new Error(`${many_item.ref} find \n${JSON.stringify(many_item.find, null, '  ')}\n is null`)
            item[keystone_field].push(ref_item._id)
          }
        }
        else {
          let ref_item = await keystone.list(item[key].ref).model.findOne(await item[key].find)
          if (ref_item === null) throw new Error(`${item[key].ref} find \n${JSON.stringify(item[key].find, null, '  ')}\n is null`)
          item[keystone_field] = ref_item._id
        }
        // delete the 'REF__xx' key so we don't keep that on the document
        delete item[key]
      }
    }
    let new_item = new List.model(item)
    await new_item.save()
    created_items.push(new_item)
  }
  return created_items
}

exports = module.exports = async function (done) {
  for (let model in DATA) {
    try {
      await create(model, DATA)
    }
    catch (e) {
      done(e)
    }
  }
  done()
};
