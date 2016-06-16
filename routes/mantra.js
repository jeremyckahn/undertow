var fs = require('fs');
var express = require('express');
var router = express.Router();
var shell = require('shelljs');

router.get('/mantra', function(req, res, next) {
  const env = JSON.stringify({});

  res.render('mantra', {
    inject: `window.env = ${env};`
  });
});

module.exports = router;
