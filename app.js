const express = require('express');
const slash = require('express-slash');
const mustacheExpress = require('mustache-express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const shell = require('shelljs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const SimpleJsonDataAdapter = require('./db/adapters/simple-json');

const app = express();
app.enable('strict routing');
const dataAdapter = new SimpleJsonDataAdapter({ dbFile: './.db.json' });

dataAdapter.connect().then(_ => {

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
    .use(cookieParser());

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
});

module.exports = app;
module.exports.dataAdapter = dataAdapter;
