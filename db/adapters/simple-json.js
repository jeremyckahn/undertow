const _ = require('lodash');
const shell = require('shelljs');
const jsonfile = require('jsonfile');
const objectHash = require('object-hash');
const DataAdapter = require('../data-adapter');

class SimpleJsonDataAdapter extends DataAdapter {
  /**
   * @param {Object} options
   * @param {string} options.dbFile
   */
  constructor (options) {
    super();

    const { dbFile } = options;

    this.dbFile = dbFile;
  }

  /**
   * @override
   * @return {Promise}
   */
  connect () {
    let resolve;
    const promise = new Promise(res => resolve = res);

    if (shell.test('-e', this.dbFile)) {
      this.readFromDisk().then(resolve);
    } else {
      this.store = {};
      resolve();
    }

    return promise;
  }

  /**
   * @return {Promise}
   */
  writeToDisk () {
    let resolve;
    const promise = new Promise(res => resolve = res);
    const stableData = _.clone(this.store);

    jsonfile.writeFile(this.dbFile, stableData, (data) => {
      resolve(stableData);
    });

    return promise;
  }

  /**
   * @return {Promise}
   */
  readFromDisk () {
    let resolve;
    const promise = new Promise(res => resolve = res);

    jsonfile.readFile(this.dbFile, (err, obj) => {
      this.store = obj;
      resolve(obj);
    });

    return promise;
  }

  /**
   * @override
   * @param {Object} options
   * @param {string} [options.id]
   * @param {string} [options.name]
   * @return {Promise}
   */
  doesUserExist (options) {
    const { name, id } = options;
    const users = this.store.users || {};

    const doesUserExist = !!(name?
      users[name]
      :
      _.find(users, { id })
    );

    return Promise.resolve(doesUserExist);
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
    const userData = _.pick(options, 'name', 'email', 'password');
    const { name } = userData;
    userData.id = objectHash(name);
    const namePath = `users.${name}`;

    if (_.get(this.store, namePath)) {
      return Promise.reject(`${namePath} already exists`);
    }

    _.set(this.store, namePath, userData);

    return this.writeToDisk().then(data => data.users[name]);
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
    const users = this.store.users || {};

    return this.doesUserExist({ name, password }).then(doesUserExist =>
      doesUserExist?
        Promise.resolve(users[name])
        :
        DataAdapter.reject.invalidCredentials()
    );
  }
}

module.exports = SimpleJsonDataAdapter;
