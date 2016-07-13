const express = require('express');
const User = require('../models/user');
const router = express.Router({
  strict: true
});

const app = require('../app');
const { dataAdapter } = app;

function createUser(req, res, next) {
  const { name, password } = req.body;
  User.create({ name, password, dataAdapter })
    .then(u => res.send(u))
    .catch(e => res.send(e));
}

router.post('/user/:method', function (req, res, next) {
  const { method } = req.params;

  switch (method) {
    case 'create':
      return createUser(...arguments);
  }
});

module.exports = router;
