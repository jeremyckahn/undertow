const _ = require('lodash');
const BaseDataAdapter = require('../db/data-adapter');

class User {
  /**
   * @param {string} [name]
   * @param {string} [id]
   * @param {DataAdapter} [dataAdapter]
   */
  constructor ({
    name = '',
    id = '',
    dataAdapter = null
  } = {}) {
    this.name = name;
    this.id = id;
    this.dataAdapter = dataAdapter;
    this.isTempUser = !this.name;
  }

  /**
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.password
   * @param {DataAdapter} options.dataAdapter
   * @return {Promise}
   */
  static create (options) {
    const dataAdapter = options.dataAdapter;

    return dataAdapter.createUser(options).then(
      res => new User({ name: res.name, id: res.id, dataAdapter })
    );
  }

  /**
   * @overide
   * @returns {Object}
   */
  toJSON () {
    return _.pick(this, 'name', 'id', 'isTempUser');
  }
}

module.exports = User;
