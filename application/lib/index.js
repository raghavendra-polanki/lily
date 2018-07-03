'use strict';

const Async = require('async');
const Express = require('express');
const Glob = require('glob');
const Path = require('path');
const Bluebird = require('bluebird');
const Seneca = require('seneca')();

// internals
const internals = {
    server: null,
    status: 'OFF',
    serverConf: null,
};

// Utilities
const getUtilities = function() {
    let options = {
        nodir: true,
        strict: true,
        cwd: process.cwd(),
    };
    return Glob.sync($.path.utils + '/*Utility.js', options);
};

const addRoutes = function(app, label) {
  console.log('Adding "' + label + '" routes...');

  app.use('/', require($.path.routes + '/' + label));
};

const init = function() {
  console.log('\nInitializing app...');
  $.NODE_ENV = process.env.NODE_ENV || 'development';
  console.log('Environment: ' + $.NODE_ENV);
  // console.log(process.env);

  $.path = {};
  $.path.root = Path.resolve(__dirname + '/..');
  $.path.routes = Path.resolve($.path.root + '/lib/routes');
  $.path.utils = Path.resolve($.path.root + '/lib/utils');
  $.path.plugins = Path.resolve($.path.root + '/lib/plugins');
  $.path.models = Path.resolve($.path.root + '/lib/models');
  $.path.services = Path.resolve($.path.root + '/lib/services');
  $.path.conf = Path.resolve($.path.root + '/etc');
  $.path.docs = Path.resolve($.path.root + '/docs');

  $.constants = require($.path.conf + '/constants');
  internals.serverConf = require($.path.conf + '/server');

  // adding bluebird's promise to global object to develop habit of using
  // bluebird only for promises. In absense of bluebird, node silently uses
  // default javascript promises which breaks seneca promisifying.
  $.promise = Bluebird;

  // add seneca object to global lib object.
  $.seneca = Seneca;
  // promisify seneca to use promises instead of callbacks to avoid callback
  // hell.
  $.act = $.promise.promisify($.seneca.act, {context: $.seneca});
};

const registerUtilities = function() {
    console.log('\n============ Registering Utility Libraries... ============');

    return new $.promise((resolve, reject) => {
      $.utils = {};
      let files = getUtilities();
      files.forEach((file) => {
          console.log(file);
          let fileName = Path.basename(file);
          let utilityName = fileName.substring(0, fileName.indexOf('Utility'));

          $.utils[utilityName] = require(file);
      });

      console.log('============ Registered Utility Libraries! ============');
      return resolve();
    });
};

const registerPlugins = function() {
  console.log('\n============ Registering plugins... ============');

  return new $.promise((resolve, reject) => {
    Async.forEachOfSeries(internals.serverConf.plugins,
    function(pluginParams, pluginName, callback) {
      console.log('\n===== Registering plugin: ' + pluginName + ' =====');

      try {
        require($.path.plugins + '/' + pluginName)(pluginParams[$.NODE_ENV])
        .then((plugin) => {
          $[pluginName] = plugin;
          callback();
        })
        .catch((err) => {
          console.error(err);
          callback(err);
        });
      } catch (exception) {
        console.error(exception);
        callback(exception);
      }
    },
    function(err) {
      if (err) {
        console.error('Plugins registration failed!');
        return reject(err);
      }
      console.log('\n============ All Plugins registered!! ============');
      return resolve();
    });
  });
};

const startServers = function() {
  console.log('\n============ Starting Servers ============');
  internals.server = {};

  return new $.promise((resolve, reject) => {
    try {
      Async.eachSeries(internals.serverConf.connections,
      function(connection, callback) {
        console.log('\nStarting server: ' + connection.label);
        let app = Express();

        let server = app.listen(connection.port, function() {
            // let host = server.address().address;
            let port = server.address().port;

            // Added custom label to identify type of server later on
            server.label = connection.label;

            addRoutes(app, connection.label);

            console.log(connection.label + ': listening at port: %s', port);

            internals.server[connection.label] = server;
            internals.status = 'ON';
            callback();
        });

        server.on('error', (err) => {
          console.error(err);
          callback(err);
        });
      },
      function(err) {
        if (err) {
          console.error('Server startup failed!!!');
          return reject(err);
        }
        internals.status === 'ON';
        console.log('\n============ All Servers Started ============');
        return resolve();
      });
    } catch (exception) {
      console.error('Server startup failed!!!');
      console.error(exception);
      return reject(exception);
    }
  });
};

// externals
const $ = {};

$.Server = function() {
  if (internals.server && internals.status === 'ON') {
      return internals.server;
  } else if (internals.status === 'OFF') {
    registerUtilities()
    .then(registerPlugins)
    .then(startServers)
    .catch((err) => {
      console.error('Unable to start application!');
      process.exit(1);
    });
  }
};

init();

module.exports = $;
