const _ = require('lodash');
const shell = require('shelljs');
const jsonfile = require('jsonfile');
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
   * @return {Promise}
   */
  initStore () {
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
      resolve();
    });

    return promise;
  }

  /**
   * @override
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.password
   * @return {Promise}
   * @throws {Error}
   */
  createUser (options) {
    // TODO: Write to disk
    const namePath = `users.${options.name}`;
    if (_.get(this.store, namePath)) {
      throw new Error(
        `SimpleJsonDataAdapter#createUser: ${namePath} already exists`
      );
    } else {
      _.set(this.store, namePath, options);
    }
  }
}

module.exports = SimpleJsonDataAdapter;
