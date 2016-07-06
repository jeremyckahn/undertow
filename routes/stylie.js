const fs = require('fs');
const express = require('express');
const User = require('../models/user');

const router = express.Router({
  strict: true
});

router.get('/stylie/', (req, res, next) => {
  let user = new User();

  const env = JSON.stringify({
    user
  });

  res.render('stylie', {
    inject: `window.env = ${env};`
  });
});

module.exports = router;
