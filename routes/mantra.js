var fs = require('fs');
var express = require('express');
var router = express.Router({
  strict: true
});

router.get('/mantra/', function(req, res, next) {
  const env = JSON.stringify({});

  res.render('mantra', {
    inject: `window.env = ${env};`
  });
});

module.exports = router;
