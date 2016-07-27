class DataAdapter {
  /**
   * @abstract
   * @return {Promise}
   */
  connect () {}

  /**
   * @abstract
   * @param {Object} options
   * @param {string} [options.id]
   * @param {string} [options.name]
   * @return {Promise}
   */
  doesUserExist () {}

  /**
   * @abstract
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.password
   * @return {Promise}
   */
  createUser () {}

  /**
   * TODO: Support optionally fetching by ID instead of name
   * @abstract
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.password
   * @return {Promise}
   */
  fetchUser () {}
}

Object.assign(DataAdapter, {
  USER_EXISTS: 'user exists',
  INVALID_CREDENTIALS: 'invalid credentials',
  NOT_LOGGED_IN: 'not logged in',

  reject: {
    userExists:
      _ => Promise.reject({ errorMessage: DataAdapter.USER_EXISTS }),
    invalidCredentials:
      _ => Promise.reject({ errorMessage: DataAdapter.INVALID_CREDENTIALS })
  }
});

module.exports = DataAdapter;
