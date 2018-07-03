'use strict';

const $ = require(__base + 'lib');

const Util = require('util');
const Winston = require('winston');

// TODO(surenderthakran): update logger transport
let logger = new (Winston.Logger)({
  transports: [
    new (Winston.transports.Console)(
      {
        colorize: true,
        prettyPrint: function(object) {
          return JSON.stringify(object);
        },
        timestamp: function() {
          return $.utils.dateTime.LogTime();
        },
      }
    ),
  ],
});

// debug logs will be printed in console in development environment only.
if ($.NODE_ENV === 'development') {
  logger.level = 'debug';
}

let externals = {};

externals.Error = (data) => {
  logger.error(data);
};

externals.Errorf = (...args) => {
  logger.error(Util.format.apply(null, args));
};

externals.Warning = (data) => {
  logger.warn(data);
};

externals.Warningf = (...args) => {
  logger.warn(Util.format.apply(null, args));
};

externals.Info = (data) => {
  logger.info(data);
};

externals.Infof = (...args) => {
  logger.info(Util.format.apply(null, args));
};

externals.Debug = (data) => {
  logger.debug(data);
};

externals.Debugf = (...args) => {
  logger.debug(Util.format.apply(null, args));
};

module.exports = (options) => {
  return new $.promise((resolve, reject) => {
    return resolve(externals);
  });
};
