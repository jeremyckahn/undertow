const express = require('express');
const router = express.Router({
  strict: true
});

function createUser(req, res, next) {
  res.send('🤔');
}

router.get('/user/:method', function (req, res, next) {
  const { method } = req.params;

  switch (method) {
    case 'create':
      return createUser(...arguments);
  }
});

module.exports = router;
