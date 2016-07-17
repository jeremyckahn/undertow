const express = require('express');
const User = require('../models/user');
const router = express.Router({
  strict: true
});

const app = require('../app');
const { dataAdapter } = app;

function createUser (req, res, next) {
  const { name, password } = req.body;

  User.create({ name, password, dataAdapter })
    .then(u => res.send(u))
    .catch(e => res.send(e));
}

function doesUserExist (req, res, next) {
  const { name, id } = req.body;

  User.doesExist({ name, id, dataAdapter })
    .then(doesExist => res.send({ doesExist }))
    .catch(e => res.send(e));
}

router.post('/user/:method', function (req, res, next) {
  const { method } = req.params;

  switch (method) {
    case 'create':
      return createUser(...arguments);
    case 'does-exist':
      return doesUserExist(...arguments);
  }
});

module.exports = router;
