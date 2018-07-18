'use strict';

const $ = require(__base + 'lib');

module.exports = {
  pattern: {
    cmd: 'find_user_id',
  },
  description: 'Service to find user with ID',
  handler: (message, callback) => {
    $.log.Debug('service find_user_id');

    $.mongodb.db.collection('users').find().toArray(function(err, doc) {
        if (err != null) {
            $.log.Error(err);
            return callback(err, null);
        }
        return callback(null, {id: packageSocialActivityID(doc.value)});
    });
  }
};
