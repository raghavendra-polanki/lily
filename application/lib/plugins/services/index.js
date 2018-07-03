'use strict';

const $ = require(__base + 'lib');

const Glob = require('glob');

const getServices = function() {
    let options = {
        nodir: true,
        strict: true,
        cwd: process.cwd(),
    };
    return Glob.sync($.path.services + '/**/*Service.js', options);
};

module.exports = (options) => {
  return new $.promise((resolve, reject) => {
    let services = getServices();
    services.forEach(function(file) {
      console.log(file);
      let service = require(file);
      $.seneca.add(service.pattern, service.handler);
    });
    return resolve();
  });
};
