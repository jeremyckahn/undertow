const jsonfile = require('jsonfile');
const DataAdapter = require('../data-adapter');

class SimpleJsonDataAdapter extends DataAdapter {
  /**
   * @param {Object} options
   * @param {string} dbFile
   */
  constructor (options) {
    super();

    const { dbFile } = options;

    this.dbFile = dbFile;
    this.store = {};
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