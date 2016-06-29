const DataAdapter = require('../../db/data-adapter');

class MockDataAdapter extends DataAdapter {
  constructor () {
    super();
  }

  /**
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.password
   * @return {Promise}
   */
  createUser (options) {
    return Promise.resolve(options);
  }
}

module.exports = MockDataAdapter;
