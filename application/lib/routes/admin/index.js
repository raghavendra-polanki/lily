'use strict';

const $ = require(__base + 'lib');

const BodyParser = require('body-parser');
const Express = require('express');
const Fs = require('fs');
const SwaggerUi = require('swagger-ui-express');
const Yaml = require('js-yaml');

const Router = Express.Router();
const SwaggerDocument = Yaml.safeLoad(
    Fs.readFileSync($.path.docs + '/openapi.yaml', 'utf8'));

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

const SwaggerOptions = {
    supportedSubmitMethods: [],
    validatorUrl: null,
  };

Router.use('/api/docs',
           SwaggerUi.serve,
           SwaggerUi.setup(SwaggerDocument, false, SwaggerOptions));

// Level 1 APIs.

Router.post('/api/category/insert',
  require($.path.routes + '/admin/handlers/category/insert'));

// Router.post('/api/category/set_parents',
//   require($.path.routes + '/admin/handlers/category/setParents'));

Router.post('/api/poll/insert',
  require($.path.routes + '/admin/handlers/poll/insert'));

// // Level 2 APIs.

Router.get('/api/category/list',
  require($.path.routes + '/admin/handlers/category/list'));

Router.get('/api/category/get',
  require($.path.routes + '/admin/handlers/category/get'));

  Router.get('/api/poll/list',
  require($.path.routes + '/admin/handlers/poll/list'));

Router.get('/api/poll/get',
  require($.path.routes + '/admin/handlers/poll/get'));

module.exports = Router;
