var BaseDataAdapter = require('../db/data-adapter');

class User {
  /**
   * @param {string} [id]
   * @param {Function} [dataAdapter]
   */
  constructor ({
    id = '',
    DataAdapter = BaseDataAdapter
  } = {}) {
    this.id = id;
    this.isTempUser = !this.id;
    this.dataAdapter = new DataAdapter();
  }
}

module.exports = User;
