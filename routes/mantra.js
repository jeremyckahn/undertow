const fs = require('fs');
const express = require('express');

const { dataAdapter } = require('../app');
const { getSessionUser } = require('./route-helpers');

const router = express.Router({
  strict: true
});

router.get('/mantra/', (req, res, next) => {
  const env = JSON.stringify({
    user: getSessionUser(dataAdapter, req.session)
  });

  res.render('mantra', {
    inject: `window.env = ${env};`
  });
});

module.exports = router;
