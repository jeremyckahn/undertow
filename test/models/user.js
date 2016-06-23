const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const { expect } = chai;

const User = require('../../models/user');

describe('User model', function () {
  describe('constructor', function () {
    it('stores id', function () {
      let user = new User('user-id');
      expect(user.id).to.equal('user-id');
    });

    describe('isTempUser', function () {
      it('is correct when user ID is provided', function () {
        let user = new User('user-id');
        expect(user.isTempUser).to.equal(false);
      });

      it('is correct when user ID is not provided', function () {
        let user = new User();
        expect(user.isTempUser).to.equal(true);
      });

      it('is correct when falsy user ID is provided', function () {
        let user = new User('');
        expect(user.isTempUser).to.equal(true);
      });
    });
  });
});
