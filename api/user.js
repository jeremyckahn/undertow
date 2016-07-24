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
  const { name, password } = req.body;
  const credentials = { name, password, dataAdapter };
  const send = res.send.bind(res);

  User.doesExist(credentials)
    .then(doesExist => doesExist?
      User.fetch(credentials)
        .then(user => {
          req.session.user = user;
          return send(user);
        })
      :
      send({ errorMessage: DataAdapter.INVALID_CREDENTIALS })
    )
    .catch(send);
}

function isLoggedIn (req, res, next) {
  res.send(!!req.session.user);
}

const handlerMap = {
  create: createUser,
  'does-exist': doesUserExist,
  login: login,
  'logged-in': isLoggedIn
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
