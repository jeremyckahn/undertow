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
   * @override
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.password
   * @return {Promise}
   */
  createUser (options) {
  }

  writeFile () {
    jsonfile.writeFileSync(this.dbFile, this.store);
  }

  readFile () {
    this.store = jsonfile.readFileSync(this.dbFile);
  }
}

module.exports = SimpleJsonDataAdapter;
