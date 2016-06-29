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
    const { name, password } = options;

    if (name === 'test-user' && password === 'password') {
      return Promise.resolve(options);
    }

    return Promise.reject(new Error());
  }
}

module.exports = MockDataAdapter;
