'use strict';

const $ = require(__base + 'lib');

const MongoClient = require('mongodb').MongoClient;
const Util = require('util');

let externals = {};

module.exports = (options) => {
  return new $.promise((resolve, reject) => {
    options.host = 'host.docker.internal';
    options.port = '27017';
    let mongodbAddress = Util.format('mongodb://%s:%s@%s:%s/%s?authSource=%s',
                                     options.user, options.pwd, options.host,
                                     options.port, options.db,
                                     options.authSource);
    MongoClient.connect(mongodbAddress, function(err, db) {
      if (err) {
        console.error('Error connecting to mongo database.');
        return reject(err);
      } else {
        console.log('Connected to mongo database');
        externals.db = db;
        return resolve(externals);
      }
    });
  });
};
