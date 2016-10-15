const express = require('express');
const User = require('../models/user');
const DataAdapter = require('../db/data-adapter');
const router = express.Router({
  strict: true
});

const app = require('../app');
const { dataAdapter } = app;

/**
 * @return {boolean}
 */
function isSessionedRequest (req) {
  return !!req.session.user;
}

function createUser (req, res, next) {
  const { name, email, password } = req.body;

  User.create({ name, password, email, dataAdapter })
    .then(u => res.send(u))
    .catch(e => res.send(e));
}

// FIXME:  It's pretty unsecure to expose this kind of an API publicly.
// Re-work the user creation process on the front end to obviate the need for
// this.
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

function logout (req, res, next) {
  return isSessionedRequest(req)?
    req.session.destroy(err => res.send(err || true))
    :
    res.send({ errorMessage: DataAdapter.NOT_LOGGED_IN })
  ;
}

function isLoggedIn (req, res, next) {
  res.send(isSessionedRequest(req));
}

const handlerMap = {
  create: createUser,
  'does-exist': doesUserExist,
  login: login,
  logout: logout,
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
