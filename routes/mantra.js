var fs = require('fs');
var express = require('express');
var router = express.Router();
var Mustache = require('mustache');
var shell = require('shelljs');

var mantraPath = shell.test('-L', './node_modules/mantra') ?
  './node_modules/mantra/dist/index.html' :
  './node_modules/mantra/index.html';

var mantraTemplate = fs.readFileSync(mantraPath).toString();

router.get('/mantra', function(req, res, next) {
  res.send(Mustache.render(mantraTemplate, {}));
});

module.exports = router;
