const DataAdapter = require('../../db/data-adapter');

const tempUserId = '12345';

class MockDataAdapter extends DataAdapter {
  constructor () {
    super();
  }

  /**
   * @override
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.password
   * @return {Promise}
   */
  createUser (options) {
    const { name, password } = options;

    if (name === 'test-user' && password === 'password') {
      return Promise.resolve({ name, id: MockDataAdapter.tempUserId });
    }

    return Promise.reject(new Error());
  }
}

MockDataAdapter.tempUserId = tempUserId;

module.exports = MockDataAdapter;
