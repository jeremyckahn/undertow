const User = require('../models/user');
const _ = require('lodash');

/**
 * @param {DataAdapter} dataAdapter
 * @param {Session} [session]
 * @return {User}
 */
module.exports.getSessionUser =
  function getSessionUser (dataAdapter, session) {

  let userOpts = { dataAdapter };
  const sessionUser = session.user;

  if (sessionUser) {
    Object.assign(userOpts, _.pick(sessionUser, 'name', 'id'));
  }

  return new User(userOpts);
};


