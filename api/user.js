const express = require('express');
const User = require('../models/user');
const DataAdapter = require('../db/data-adapter');
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

function login (req, res, next) {
  res.send({ errorMessage: DataAdapter.INVALID_CREDENTIALS });
}

const handlerMap = {
  create: createUser,
  'does-exist': doesUserExist,
  login: login
};

router.post('/user/:method', function (req, res, next) {
  const { method } = req.params;

  const handler = handlerMap[method];

  return handler?
    handler(...arguments)
    :
    res.status(404).send()
  ;
});

module.exports = router;
