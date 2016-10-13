const express = require('express');
const cors = require('cors');
const session = require('express-session');
const slash = require('express-slash');
const mustacheExpress = require('mustache-express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const shell = require('shelljs');
const bodyParser = require('body-parser');
const SimpleJsonDataAdapter = require('./db/adapters/simple-json');

// FIXME: Development data store, NOT FOR PRODUCTION.
const FileStore = require('session-file-store')(session);

const app = express();
app.enable('strict routing');

/**
 * @param {DataAdapter} dataAdapter
 */
app.start = function (dataAdapter) {
  app.dataAdapter = dataAdapter;

  // Register '.mustache' extension with The Mustache Express
  app.engine('mustache', mustacheExpress());

  // view engine setup
  app
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'mustache');

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    // FIXME: This is not set up securely or scalably.  These options MUST be
    // revisited before this application is used in any kind of a public
    // environment.
    .use(session({
      store: new FileStore(),
      secret: 'lol its a secret'
    }));

  if (process.env.DEBUG) {
    app.use(cors());
  }

  app
    .use(express.static(
      path.join(__dirname, 'public')
    ))
    .use('/', express.static(
      path.join(__dirname, 'node_modules/rekapi.com')
    ));

  ['stylie', 'mantra'].forEach(appName => {
    const appPath = shell.test('-L', `./node_modules/${appName}`) ?
      `./node_modules/${appName}/dist` :
      `./node_modules/${appName}`;

    app
      .use('/', require(`./routes/${appName}`))
      .use(`/${appName}`,
        express.static(path.join(__dirname, appPath))
      );
  });

  ['user'].forEach(endpoint => {
    app.use('/api/', require(`./api/${endpoint}`));
  });

  app.use(slash());

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
};

module.exports = app;
