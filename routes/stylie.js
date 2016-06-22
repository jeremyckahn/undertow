var fs = require('fs');
var express = require('express');
var User = require('../models/user');

var router = express.Router({
  strict: true
});

router.get('/stylie/', function(req, res, next) {
  // FIXME: Hardcoded value
  //let user = new User('test-user');
  let user = false;

  const env = JSON.stringify({
    user
  });

  res.render('stylie', {
    inject: `window.env = ${env};`
  });
});

module.exports = router;
