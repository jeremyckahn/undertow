const fs = require('fs');
const express = require('express');
const router = express.Router({
  strict: true
});

router.get('/mantra/', (req, res, next) => {
  const env = JSON.stringify({});

  res.render('mantra', {
    inject: `window.env = ${env};`
  });
});

module.exports = router;
