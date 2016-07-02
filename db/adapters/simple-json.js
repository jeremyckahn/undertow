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
    this.initStore();
  }

  initStore () {
    if (shell.test('-e', this.dbFile)) {
      this.readFile();
    } else {
      this.store = {};
    }
  }

  /**
   * @return {Promise}
   */
  writeFile () {
    let resolve;
    const promise = new Promise(res => resolve = res);

    jsonfile.writeFile(this.dbFile, this.store, () => resolve());

    return promise;
  }

  readFile () {
    this.store = jsonfile.readFileSync(this.dbFile);
  }

  /**
   * @override
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.password
   * @return {Promise}
   */
  createUser (options) {
    _.set(this.store, `users.${options.name}`, options);
  }
}

module.exports = SimpleJsonDataAdapter;
