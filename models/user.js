var BaseDataAdapter = require('../db/data-adapter');

class User {
  /**
   * @param {string} [name]
   * @param {string} [id]
   * @param {Function} [dataAdapter]
   */
  constructor ({
    name = '',
    id = '',
    DataAdapter = BaseDataAdapter
  } = {}) {
    this.name = name;
    this.id = id;
    this.isTempUser = !this.name;
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
      res => new User({ name: res.name, id: res.id, dataAdapter })
    );
  }
}

module.exports = User;
