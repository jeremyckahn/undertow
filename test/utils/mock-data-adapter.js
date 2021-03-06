const DataAdapter = require('../../db/data-adapter');

const tempUserId = '12345';

const newUserName = 'new-user';
const newUserId = '121212';
const newUserEmail = 'new@user.com';
const newUserPassword = 'new-user-password';
const existingUserName = 'existing-user';
const existingUserEmail = 'existing@user.com';
const existingUserId = '23456';
const existingUserPassword = 'existing-user-password';
const nonExistingUserName = 'non-existing-user';
const nonExistingUserEmail = 'non-existing@user.com';
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
   * @param {string} options.password
   * @param {string} [options.id]
   * @param {string} [options.name]
   * @return {Promise}
   */
  doesUserExist (options) {
    const { id, name, password } = options;

    return Promise.resolve(
      (name === existingUserName || id === existingUserId)
        && password === existingUserPassword
    );
  }

  /**
   * @override
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.email
   * @param {string} options.password
   * @return {Promise}
   */
  createUser (options) {
    const { name, password } = options;

    if (name === newUserName && password === newUserPassword) {
      return Promise.resolve({ name, id: tempUserId });
    }

    if (name === existingUserName) {
      return DataAdapter.reject.userExists();
    }
  }

  /**
   * @override
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.password
   * @return {Promise}
   */
  fetchUser (options) {
    const { name, password } = options;

    if (name === existingUserName && password === existingUserPassword) {
      return Promise.resolve({ name, id: existingUserId });
    }

    return DataAdapter.reject.invalidCredentials();
  }
}

MockDataAdapter.tempUserId = tempUserId;
MockDataAdapter.existingUserName = existingUserName;
MockDataAdapter.existingUserEmail = existingUserEmail;
MockDataAdapter.existingUserPassword = existingUserPassword;
MockDataAdapter.existingUserId = existingUserId;
MockDataAdapter.newUserName = newUserName;
MockDataAdapter.newUserId = newUserId;
MockDataAdapter.newUserEmail = newUserEmail;
MockDataAdapter.newUserPassword = newUserPassword;
MockDataAdapter.nonExistingUserName = nonExistingUserName;
MockDataAdapter.nonExistingUserEmail = nonExistingUserEmail;
MockDataAdapter.nonExistingUserId = nonExistingUserId;

module.exports = MockDataAdapter;
