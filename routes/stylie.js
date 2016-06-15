var fs = require('fs');
var express = require('express');
var router = express.Router();
var Mustache = require('mustache');
var shell = require('shelljs');

var styliePath = shell.test('-L', './node_modules/stylie') ?
  './node_modules/stylie/dist/index.html' :
  './node_modules/stylie/index.html';

var stylieTemplate = fs.readFileSync(styliePath).toString();

/* GET home page. */
router.get('/stylie', function(req, res, next) {
  const env = JSON.stringify({});

  res.send(Mustache.render(stylieTemplate, {
    inject: `window.env = ${env};`
  }));
});

module.exports = router;
