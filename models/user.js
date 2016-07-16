const _ = require('lodash');
const tcomb = require('tcomb');
const BaseDataAdapter = require('../db/data-adapter');

const UserShape = tcomb.interface({
  name: tcomb.String,
  password: tcomb.String,
  dataAdapter: tcomb.irreducible('DataAdapter',
    x => x instanceof BaseDataAdapter
  )
}, {
  name: 'User',
  strict: true
});

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
    if (!UserShape.is(options)) {
      return User.reject.insufficientArguments();
    }

    const dataAdapter = options.dataAdapter;

    return dataAdapter.createUser(options)
      .then(
        res => new User({ name: res.name, id: res.id, dataAdapter })
      ).catch(
        err => Promise.reject(err)
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

Object.assign(User, {
  INSUFFICIENT_ARGUMENTS: 'insufficient arguments',

  reject: {
    insufficientArguments: _ =>
      Promise.reject({ errorMessage: User.INSUFFICIENT_ARGUMENTS })
  }
});

module.exports = User;
