var fs = require('fs');
var express = require('express');
var router = express.Router({
  strict: true
});

router.get('/stylie/', function(req, res, next) {
  const env = JSON.stringify({});

  res.render('stylie', {
    inject: `window.env = ${env};`
  });
});

module.exports = router;
