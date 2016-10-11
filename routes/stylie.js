const fs = require('fs');
const express = require('express');

const { dataAdapter } = require('../app');
const { getSessionUser } = require('./route-helpers');

const router = express.Router({
  strict: true
});

router.get('/stylie/', (req, res, next) => {
  const env = JSON.stringify({
    user: getSessionUser(dataAdapter, req.session)
  });

  res.render('stylie', {
    inject: `window.env = ${env};`
  });
});

module.exports = router;
