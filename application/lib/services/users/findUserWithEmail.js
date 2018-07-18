'use strict';

const $ = require(__base + 'lib');

module.exports = {
  pattern: {
    cmd: 'find_user_email',
  },
  description: 'Service to find user with email',
  handler: (message, callback) => {
    $.log.Debug('service find_user_email');

    $.mongodb.db.collection('users').find({ email_ids: [message.email] }).toArray(function(err, doc) {
        if (err != null) {
            $.log.Error(err);
            return callback(err, null);
        }
        return callback(null, {user: doc});
    });
  }
};
