'use strict';

const $ = require(__base + 'lib');

const BodyParser = require('body-parser');
const Express = require('express');

const Router = Express.Router();

Router.use(BodyParser.json());
Router.use(BodyParser.urlencoded({extended: true}));

// Middleware to log all incoming requests.
Router.use((req, res, next) => {
  let requesterIP;
  try {
    requesterIP = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(',')[0];
  } catch (err) {
    $.log.Errorf('unable to read requester IP for:');
    $.log.Error(req);
  }

  $.log.Infof('%s -> %s %s', requesterIP, req.method, req.url);
  if (req.method === 'GET') {
    $.log.Debug(req.query);
  } else if (req.method === 'POST') {
    $.log.Debug(req.body);
  }
  next();
});

// Router.post('/v1/feeds/engine',
//   require($.path.routes + '/api/handlers/feeds/engine'));

// Router.post('/v1/feeds/social',
//   require($.path.routes + '/api/handlers/feeds/social'));

module.exports = Router;
