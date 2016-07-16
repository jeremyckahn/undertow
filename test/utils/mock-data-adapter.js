const DataAdapter = require('../../db/data-adapter');

const tempUserId = '12345';

class MockDataAdapter extends DataAdapter {
  constructor () {
    super();
  }

  connect () {
    return Promise.resolve();
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

    if (name === 'existing-user') {
      return DataAdapter.reject.userExists();
    }
  }
}

MockDataAdapter.tempUserId = tempUserId;

module.exports = MockDataAdapter;
