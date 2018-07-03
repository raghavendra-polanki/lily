'use strict';

const $ = require(__base + 'lib');

const padNumber = (num, size) => {
  let s = num.toString();
  while (s.length < size) {
    s = '0' + s;
  }
  return s;
};

const packageCategoryID = (record) => {
  return record.prefix + padNumber(record.count, 4);
};

module.exports = {
  pattern: {
    cmd: 'generate_category_id',
  },
  description: 'Service to generate a new category ID',
  handler: (message, callback) => {
    $.log.Debug('service generate_category_id');

    $.mongodb.db.collection('category_counter').findAndModify(
      {prefix: $.utils.dateTime.CurrentYYMMDD()}, [],
      {$inc: {count: 1}},
      {upsert: true, new: true}, (err, doc) => {
        if (err != null) {
          $.log.Error(err);
          return callback(err, null);
        }
        return callback(null, {id: packageCategoryID(doc.value)});
      });
  },
};
