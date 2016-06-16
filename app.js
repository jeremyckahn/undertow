var express = require('express');
var mustacheExpress = require('mustache-express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var shell = require('shelljs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/',
  express.static(path.join(__dirname, 'node_modules/rekapi.com'))
);

[
 'stylie',
 'mantra'
].forEach(function (appName) {
  var appPath = shell.test('-L', `./node_modules/${appName}`) ?
    `./node_modules/${appName}/dist` :
    `./node_modules/${appName}`;

  app.use('/', require(`./routes/${appName}`));

  app.use(`/${appName}`,
    express.static(path.join(__dirname, appPath))
  );
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
