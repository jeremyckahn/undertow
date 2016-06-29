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

  /**
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.password
   * @param {Function} options.dataAdapter
   * @return {Promise}
   */
  static create (options) {
    const dataAdapter = new options.dataAdapter();

    return dataAdapter.createUser(options).then(
      res => new User(res.id, dataAdapter)
    );
  }
}

module.exports = User;
