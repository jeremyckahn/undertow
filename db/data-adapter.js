class DataAdapter {
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
}

Object.assign(DataAdapter, {
  USER_EXISTS: 'user exists',

  reject: {
    userExists:
      _ => Promise.reject({ errorMessage: DataAdapter.USER_EXISTS })
  }
});

module.exports = DataAdapter;
