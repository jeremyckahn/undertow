class DataAdapter {
  /**
   * @abstract
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.password
   * @return {Promise}
   */
  createUser () {}
}

module.exports = DataAdapter;
