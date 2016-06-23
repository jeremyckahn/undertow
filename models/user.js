class User {
  /**
   * @param {string} id
   */
  constructor (id = '') {
    this.id = id;
    this.isTempUser = !this.id;
  }
}

module.exports = User;
