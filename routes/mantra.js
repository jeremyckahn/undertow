const fs = require('fs');
const express = require('express');
const User = require('../models/user');
const app = require('../app');
const { dataAdapter } = app;

const router = express.Router({
  strict: true
});

router.get('/mantra/', (req, res, next) => {
  let user = new User({ dataAdapter });
  const env = JSON.stringify({ user });

  res.render('mantra', {
    inject: `window.env = ${env};`
  });
});

module.exports = router;
