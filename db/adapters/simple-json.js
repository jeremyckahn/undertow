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

    jsonfile.writeFile(this.dbFile, this.store, resolve);

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
   * @param {string} options.name
   * @param {string} options.password
   * @return {Promise}
   */
  createUser (options) {
    const userData = _.pick(options, 'name', 'password');
    const { name } = userData;
    userData.id = objectHash(name);
    const namePath = `users.${name}`;

    if (_.get(this.store, namePath)) {
      return Promise.reject(`${namePath} already exists`);
    }

    _.set(this.store, namePath, userData);

    return this.writeToDisk();
  }
}

module.exports = SimpleJsonDataAdapter;
