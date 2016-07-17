const DataAdapter = require('../../db/data-adapter');

const tempUserId = '12345';

const existingUserName = 'existing-user';
const existingUserId = '23456';
const nonExistingUserName = 'non-existing-user';
const nonExistingUserId = '00000';

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
   * @param {string} [options.id]
   * @param {string} [options.name]
   * @return {Promise}
   */
  doesUserExist (options) {
    const { id, name } = options;

    return Promise.resolve(
      name === existingUserName || id === existingUserId
    );
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

    if (name === existingUserName) {
      return DataAdapter.reject.userExists();
    }
  }
}

MockDataAdapter.tempUserId = tempUserId;
MockDataAdapter.existingUserName = existingUserName;
MockDataAdapter.existingUserId = existingUserId;
MockDataAdapter.nonExistingUserName = nonExistingUserName;
MockDataAdapter.nonExistingUserId = nonExistingUserId;

module.exports = MockDataAdapter;
