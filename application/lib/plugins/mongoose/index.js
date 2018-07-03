'use strict';

const $ = require(__base + 'lib');

const Glob = require('glob');
const Mongoose = require('mongoose');
const Path = require('path');
const Util = require('util');

Mongoose.promise = $.promise;

let dbConnection;

const getModels = function() {
    let options = {
        nodir: true,
        strict: true,
        cwd: process.cwd(),
    };
    return Glob.sync($.path.models + '/*.js', options);
};

const capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const registerModels = function() {
  $.model= {};
  let models = getModels();
  models.forEach((model) => {
    console.log(model);
    let fileName = Path.basename(model);
    let modelName = capitalizeFirstLetter(fileName.substring(0,
        fileName.indexOf('.')));
    $.model[modelName] = dbConnection.model(modelName, require(model));
  });
};

module.exports = (options) => {
  return new $.promise((resolve, reject) => {
    options.host = 'host.docker.internal';
    options.port = '27017';
    let mongodbAddress = Util.format('mongodb://%s:%s@%s:%s/%s?authSource=%s',
                                     options.user, options.pwd, options.host,
                                     options.port, options.db,
                                     options.authSource);
    dbConnection = Mongoose.createConnection(mongodbAddress, {
      config: {
        autoIndex: false, // disable automatic creation of indices on load.
      },
    });

    dbConnection.on('connecting', () => {
      console.log('Connecting to mongo database');
    });
    dbConnection.on('error', (err) => {
      console.error('Error connecting to mongo database.');
      console.error(err);
      return reject(err);
    });
    dbConnection.once('open', () => {
      console.log('Connected to mongo database');
      console.log('Registering mongoose models...');
      registerModels();
      console.log('Registered mongoose models');
      return resolve(dbConnection);
    });
  });
};
