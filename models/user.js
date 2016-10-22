const _ = require('lodash');
const tcomb = require('tcomb');
const BaseDataAdapter = require('../db/data-adapter');
const constant = require('../constant');

const commonUserShapeProperties = {
  name: tcomb.String,
  password: tcomb.String,
  dataAdapter: tcomb.irreducible('DataAdapter',
    x => x instanceof BaseDataAdapter
  )
};

const fullUserShape = tcomb.interface(
  Object.assign({
    email: tcomb.irreducible('email',
      x => !!(x || '').match(constant.EMAIL_REGEX)
    ),
  }, commonUserShapeProperties), {
    name: 'FullUser',
    strict: true
  }
);

const loginUserShape = tcomb.interface(
  Object.assign({},
    commonUserShapeProperties
  ), {
    name: 'LoginUser',
    strict: true
  }
);

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
   * @param {DataAdapter} options.dataAdapter
   * @param {string} options.password
   * @param {string} [options.id]
   * @param {string} [options.name]
   * @return {Promise}
   */
  static doesExist (options) {
    const { dataAdapter, id, name, password } = options;

    return dataAdapter.doesUserExist({ id, name, password });
  }

  /**
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.email
   * @param {string} options.password
   * @param {DataAdapter} options.dataAdapter
   * @return {Promise}
   */
  static create (options) {
    if (!fullUserShape.is(options)) {
      return User.reject.invalidArguments();
    }

    const { dataAdapter } = options;

    return dataAdapter.createUser(options)
      .then(
        res => new User({ name: res.name, id: res.id, dataAdapter })
      );
  }

  /**
   * TODO: Support optionally fetching by ID instead of name
   * @param {Object} options
   * @param {string} options.name
   * @param {string} options.password
   * @param {DataAdapter} options.dataAdapter
   * @return {Promise}
   */
  static fetch (options) {
    if (!loginUserShape.is(options)) {
      return User.reject.invalidArguments();
    }

    const { dataAdapter, name, password } = options;

    return dataAdapter.fetchUser({ name, password })
      .then(
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

Object.assign(User, {
  INVALID_ARGUMENTS: 'invalid arguments',

  reject: {
    invalidArguments: _ =>
      Promise.reject({ errorMessage: User.INVALID_ARGUMENTS })
  }
});

module.exports = User;
